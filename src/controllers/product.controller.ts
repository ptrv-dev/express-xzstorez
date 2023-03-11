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
      sizes: sizes?.filter((size) => Boolean(size.trim().length)),
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
    const {
      q = '',
      category,
      brand,
      sort,
      order,
      limit = 20,
      page = 1,
    } = req.query;

    const query = {} as { [key: string]: any };
    if (q) query.title = { $regex: new RegExp(q), $options: 'i' };
    if (category) query.category = category;
    if (brand) query.brand = brand;

    const productsCount = await ProductModel.countDocuments();
    const pagesCount = Math.ceil(productsCount / limit);

    const products = await ProductModel.find(query)
      .sort({ [sort || 'createdAt']: order || 'desc' })
      .skip(Math.ceil(limit * (page - 1)))
      .limit(limit)
      .populate('brand category');

    return res.status(200).json({ data: products, page, pagesCount });
  } catch (error) {
    console.log(`[Error] Product get all error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function getOne(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id).populate('category brand');

    if (!product)
      return res.status(404).json({ msg: "Product doesn't exists" });

    return res.status(200).json(product);
  } catch (error) {
    console.log(`[Error] Product get one error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function removeOne(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({ msg: "Product doesn't exists" });

    return res.status(200).json(product);
  } catch (error) {
    console.log(`[Error] Product remove one error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function edit(
  req: Request<{ id: string }, {}, productCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { id } = req.params;

    const product = await ProductModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        category: req.body.category || null,
        brand: req.body.brand || null,
      },
      {
        returnDocument: 'after',
      }
    );

    if (!product)
      return res.status(404).json({ msg: "Product doesn't exists" });

    return res.status(200).json(product);
  } catch (error) {
    console.log(`[Error] Product edit error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
