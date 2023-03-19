import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { couponCreateBody } from '../@types/requestBody';
import CouponModel from '../models/CouponModel';

export async function create(
  req: Request<{}, {}, couponCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { coupon, name, percent } = req.body;

    const newCoupon = await CouponModel.create({ name, coupon, percent });

    return res.status(200).json(newCoupon);
  } catch (error) {
    console.log(`[Error] Coupon create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
