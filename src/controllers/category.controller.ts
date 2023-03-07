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

export async function getAll(req: Request, res: Response) {
  try {
    const categories = await CategoryModel.find();

    return res.status(200).json({ data: categories });
  } catch (error) {
    console.log(`[Error] Category get all error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function removeOne(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const category = await CategoryModel.findByIdAndDelete(id);

    if (!category)
      return res.status(404).json({ msg: "Category doesn't exists" });

    return res.status(200).json(category);
  } catch (error) {
    console.log(`[Error] Category remove one error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}

export async function edit(
  req: Request<{ id: string }, {}, categoryCreateBody>,
  res: Response
) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { id } = req.params;
    const { title } = req.body;

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { title },
      { returnDocument: 'after' }
    );

    if (!category)
      return res.status(404).json({ msg: "Category doesn't exists" });

    return res.status(200).json(category);
  } catch (error) {
    console.log(`[Error] Category edit error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
