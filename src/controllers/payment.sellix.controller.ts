import axios from 'axios';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  paymentCreateBody,
  sellixOrderCheckBody,
  sellixOrderCreateBody,
} from '../@types/requestBody';
import CouponModel from '../models/CouponModel';
import InviteModel from '../models/InviteModel';
import SellixOrderModel from '../models/SellixOrderModel';
import SettingsModel from '../models/SettingsMode';
import { sendInviteUsed } from './invite.controller';

const DOMAIN = 'http://localhost:3000';
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

    if (req.body.invite?.trim()) {
      const invite = await InviteModel.findOne({
        email: req.body.invite.trim(),
      });
      if (invite) {
        sendInviteUsed(invite.email);
      }
    }

    const settings = await SettingsModel.findOne();
    const cryptoDiscount = Number(settings?.cryptoDiscount);

    if (!!cryptoDiscount) total -= (total * cryptoDiscount) / 100;

    const payload = {
      title: title.join('; '),
      currency: 'USD',
      value: total,
      return_url: `${DOMAIN}/order-complete?uniqueId={{uniqid}}&orderId=${req.body.orderId}&merchant=sellix`,
      email: req.body.email,
    };

    const { data } = await appAxios.post('/payments', payload);
    return res.status(200).json(data);
  } catch (error) {
    console.log(`[Error] Payment (Sellix) create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function createOrder(
  req: Request<{}, {}, sellixOrderCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const order = await SellixOrderModel.create(req.body);

    return res.status(200).json(order);
  } catch (error) {
    console.log(`[Error] Order (Sellix) create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function checkOrder(
  req: Request<{}, {}, sellixOrderCheckBody>,
  res: Response
) {
  try {
    if (!req.body.orderId || !req.body.uniqueId) return res.sendStatus(400);

    const order = await SellixOrderModel.findById(req.body.orderId);

    if (!order)
      return res
        .status(500)
        .json({ msg: "Order with this id doesn't exists..." });

    if (order.track) return res.status(200).json({ track: order.track });

    const track = (Math.random() * 1000000000).toFixed(0);

    await order.updateOne({
      track: track,
      uniqueId: req.body.uniqueId,
      status: 1,
    });

    return res.status(200).json({ track });
  } catch (error) {
    console.log(`[Error] Order (Sellix) check error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
