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

export async function getAll(req: Request, res: Response) {
  try {
    const coupons = await CouponModel.find();

    return res.status(200).json({ data: coupons });
  } catch (error) {
    console.log(`[Error] Coupon get all error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function getOne(
  req: Request<{}, {}, {}, { q: string }>,
  res: Response
) {
  try {
    const { q } = req.query;

    const coupon = await CouponModel.findOne({
      coupon: { $regex: new RegExp(`^${q}$`), $options: 'i' },
    });

    if (!coupon) return res.status(404).json({ msg: 'Incorrect coupon!' });

    return res.status(200).json(coupon);
  } catch (error) {
    console.log(`[Error] Coupon get one error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function edit(
  req: Request<{ id: string }, {}, couponCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { id } = req.params;

    const coupon = await CouponModel.findByIdAndUpdate(id, req.body, {
      returnDocument: 'after',
    });

    if (!coupon) return res.status(404).json({ msg: "Coupon doesn't exists" });

    return res.status(200).json(coupon);
  } catch (error) {
    console.log(`[Error] Coupon edit error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function removeOne(req:Request<{id:string}>,res:Response) {
  try {
    const {id} = req.params;

    const coupon = await CouponModel.findByIdAndRemove(id);

    if (!coupon) return res.status(404).json({ msg: "Coupon doesn't exists" });

    return res.sendStatus(200);
  } catch (error) {
    console.log(`[Error] Coupon remove one error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}