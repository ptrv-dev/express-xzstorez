import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import BrandModel from '../models/BrandModel';

import { brandCreateBody } from '../@types/requestBody';

export async function create(
  req: Request<{}, {}, brandCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { image, title } = req.body;

    const brand = await BrandModel.create({ image, title });

    return res.status(200).json(brand);
  } catch (error) {
    console.log(`[Error] Brand create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const brands = await BrandModel.find();

    return res.status(200).json({ data: brands });
  } catch (error) {
    console.log(`[Error] Brand get all error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
