import axios from 'axios';
import { Request, Response } from 'express';
import { paymentCreateBody } from '../@types/requestBody';
import CouponModel from '../models/CouponModel';

const API_KEY =
  'pMu9opKQiSHAhjsmQLRCMNziw4LLpi5pw4wJbE6O1hEoEAd1HNi7zIPpDwwRerYt';

const appAxios = axios.create({
  baseURL: 'https://dev.sellix.io/v1',
  headers: { Authorization: `Bearer ${API_KEY}` },
});

interface CreateBody extends paymentCreateBody {
  orderId: string;
  email: string;
}

export async function create(req: Request<{}, {}, CreateBody>, res: Response) {
  try {
    if (!req.body.cart || !req.body.email || !req.body.orderId)
      return res.sendStatus(400);

    let title = [] as string[];
    let total = 0;

    req.body.cart.forEach((item) => {
      title.push(`${item.name} x ${item.quantity}`);
      total += item.price * item.quantity;
    });

    if (req.body.coupon) {
      const coupon = await CouponModel.findOneAndUpdate(
        {
          coupon: { $regex: new RegExp(`^${req.body.coupon}$`), $options: 'i' },
        },
        { $inc: { uses: 1 } }
      );
      if (coupon) {
        total -= (total * Number(coupon.percent)) / 100;
      }
    }

    const payload = {
      title: title.join('; '),
      currency: 'USD',
      value: total,
      return_url: `http://localhost:3000/order-complete?uniqueId={{uniqid}}&orderId=${req.body.orderId}&merchant=sellix`,
      email: req.body.email,
    };

    const { data } = await appAxios.post('/payments', payload);
    return res.status(200).json(data);
  } catch (error) {
    console.log(`[Error] Payment (Sellix) create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
