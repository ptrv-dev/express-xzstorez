import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import ProductModel from '../models/ProductModel';

import { productCreateBody } from '../@types/requestBody';

export async function create(
  req: Request<{}, {}, productCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { images, title, description, category, brand, sizes, price } =
      req.body;

    const product = await ProductModel.create({
      images,
      title,
      description,
      category,
      brand,
      sizes,
      price,
    });

    return res.status(200).json(product);
  } catch (error) {
    console.log(`[Error] Product create error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
