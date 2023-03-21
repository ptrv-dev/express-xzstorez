import { Request, Response } from 'express';
import { Client, Environment, OrderLineItem } from 'square';
import { paymentCreateBody } from '../@types/requestBody';
import CouponModel from '../models/CouponModel';
import SquareOrderModel from '../models/SquareOrderModel';

const DOMAIN = 'http://localhost:3000';
const ACCESS_TOKEN =
  'EAAAEHJLSsIiZUCLzXHB_bNQRj6A_vFbmHVyaUVnYBbdQarVyUXiCpVhnmo6Hsok';
const LOCATION = 'L2D790ZS6CP1F';

export const client = new Client({
  accessToken: ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

export async function create(
  req: Request<{}, {}, paymentCreateBody>,
  res: Response
) {
  try {
    const lineItems: OrderLineItem[] = [];

    for (const item of req.body.cart) {
      lineItems.push({
        name: item.name,
        quantity: String(item.quantity),
        itemType: 'ITEM',
        basePriceMoney: {
          amount: BigInt(Number(item.price).toFixed(2).replace('.', '')),
          currency: 'USD',
        },
      });
    }

    let promo;

    if (req.body.coupon) {
      const coupon = await CouponModel.findOneAndUpdate(
        {
          coupon: { $regex: new RegExp(`^${req.body.coupon}$`), $options: 'i' },
        },
        { $inc: { uses: 1 } }
      );
      if (coupon) {
        promo = {
          name: coupon.name,
          type: 'FIXED_PERCENTAGE',
          percentage: String(coupon.percent),
        };
      }
    }

    const response = await client.checkoutApi.createPaymentLink({
      order: {
        locationId: LOCATION,
        lineItems,
        discounts: promo ? [promo] : [],
      },
      checkoutOptions: {
        redirectUrl: `${DOMAIN}/order-complete`,
        askForShippingAddress: true,
        acceptedPaymentMethods: {
          applePay: true,
          googlePay: true,
          cashAppPay: true,
          afterpayClearpay: true,
        },
      },
    });

    if (!response.result.paymentLink || !response.result.paymentLink.url)
      return res.sendStatus(500);

    return res.status(200).json({ url: response.result.paymentLink.url });
  } catch (error) {
    console.log(`[Error] Payment (SquareUp) create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

interface orderCreateBody {
  orderId: string;
}

export async function createOrder(
  req: Request<{}, {}, orderCreateBody>,
  res: Response
) {
  try {
    if (!req.body.orderId)
      return res.status(400).json({ msg: 'Invalid orderId!' });

    const { orderId } = req.body;

    const exists = await SquareOrderModel.findOne({ orderId });

    if (exists) {
      return res.status(200).json({ track: exists.track });
    }

    const track = (Math.random() * 1000000000).toFixed(0);

    try {
      await client.ordersApi.retrieveOrder(orderId);
    } catch (error) {
      return res.status(400).json({ msg: 'Incorrect orderId!' });
    }

    const order = await SquareOrderModel.create({ track, orderId });

    return res.status(200).json({ track: order.track });
  } catch (error) {
    console.log(`[Error] Order create (SquareUp) error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
