import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import ProductModel from '../models/ProductModel';

import { productCreateBody } from '../@types/requestBody';
import { productGetAllQuery } from '../@types/requestQuery';

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

export async function getAll(
  req: Request<{}, {}, {}, productGetAllQuery>,
  res: Response
) {
  try {
    const { q = '', category, brand, sort, order } = req.query;

    const products = await ProductModel.find({
      title: { $regex: new RegExp(q), $options: 'i' },
      category: category || undefined,
      brand: brand || undefined,
    })
      .sort({ [sort || 'createdAt']: order || 'desc' })
      .limit(20)
      .populate('brand category');

    return res.status(200).json(products);
  } catch (error) {
    console.log(`[Error] Product get all error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
