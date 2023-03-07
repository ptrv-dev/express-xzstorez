import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../app';

import UserModel from '../models/UserModel';

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(403).json({ message: 'Access denied' });

    const _id = jwt.verify(token, JWT_SECRET);

    const user = await UserModel.findById(_id);

    if (!user)
      return res
        .cookie('token', '')
        .status(403)
        .json({ message: 'Access denied' });

    next();
  } catch (error) {
    console.log(`[Error] Verify token error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
