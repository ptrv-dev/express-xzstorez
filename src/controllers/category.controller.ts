import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { categoryCreateBody } from '../@types/requestBody';

import CategoryModel from '../models/CategoryModel';

export async function create(
  req: Request<{}, {}, categoryCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { title } = req.body;

    const category = await CategoryModel.create({ title });

    return res.status(200).json(category);
  } catch (error) {
    console.log(`[Error] Category create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
