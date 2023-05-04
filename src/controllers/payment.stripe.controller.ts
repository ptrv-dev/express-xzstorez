import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Stripe from 'stripe';
import { orderCreateBody, paymentCreateBody } from '../@types/requestBody';
import CouponModel from '../models/CouponModel';
import InviteModel from '../models/InviteModel';
import OrderModel from '../models/OrderModel';
import { sendInviteUsed } from './invite.controller';

export const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {
  apiVersion: '2022-11-15',
});

const domain = 'http://localhost:3000';

export async function create(
  req: Request<{}, {}, paymentCreateBody>,
  res: Response
) {
  try {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of req.body.cart) {
      const product = await stripe.products.create({
        type: 'good',
        shippable: true,
        name: item.name,
        description: item.description,
      });
      line_items.push({
        price_data: {
          product: product.id,
          currency: 'USD',
          unit_amount_decimal: Number(item.price).toFixed(2).replace('.', ''),
        },
        quantity: item.quantity,
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
        promo = await stripe.coupons.create({
          percent_off: Number(coupon.percent),
          name: coupon.name,
          duration: 'once',
        });
      }
    }

    if (req.body.invite?.trim()) {
      const invite = await InviteModel.findOne({
        email: req.body.invite.trim(),
      });
      if (invite) {
        sendInviteUsed(invite.email);
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${domain}/order-complete?session_id={CHECKOUT_SESSION_ID}&merchant=stripe`,
      cancel_url: `${domain}/cart`,
      discounts: [{ coupon: promo?.id || undefined }],
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: [
          'US',
          'CA',
          'MX',
          'HN',
          'ES',
          'PT',
          'FR',
          'DE',
          'SE',
          'RU',
          'UA',
          'PL',
          'BY',
          'AC',
          'IE',
          'NO',
          'FI',
          'RO',
          'TR',
          'BG',
          'KZ',
          'PT',
        ],
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    if (!session.url) return res.sendStatus(500);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.log(`[Error] Payment create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function get(
  req: Request<{}, {}, {}, { session_id: string }>,
  res: Response
) {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    return res.status(200).json(session);
  } catch (error) {
    console.log(`[Error] Payment info error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function createOrder(
  req: Request<{}, {}, orderCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { session_id } = req.body;

    const exists = await OrderModel.findOne({ session_id });

    if (exists) {
      return res.status(200).json({ track: exists.track });
    }

    const track = (Math.random() * 1000000000).toFixed(0);

    try {
      await stripe.checkout.sessions.retrieve(session_id);
    } catch (error) {
      return res.status(400).json({ msg: 'Incorrect session_id!' });
    }

    const order = await OrderModel.create({ track, session_id });

    return res.status(200).json({ track: order.track });
  } catch (error) {
    console.log(`[Error] Order create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function track(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const order = await OrderModel.findOne({ track: id });

    if (!order) return res.sendStatus(404);

    const session = await stripe.checkout.sessions.retrieve(order.session_id);

    return res.status(200).json(session);
  } catch (error) {
    console.log(`[Error] Order create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
