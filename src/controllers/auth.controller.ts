import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/UserModel';

import { loginBody } from '../@types/requestBody';

import { JWT_SECRET } from '../app';

export async function login(req: Request<{}, {}, loginBody>, res: Response) {
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) return res.status(400).json(validation);

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username: username });
    if (!user) return res.status(401).json({ msg: 'Incorrect credentials' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ msg: 'Incorrect credentials' });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    return res.cookie('token', token).status(200).json({ success: true });
  } catch (error) {
    console.log(`[Error] Login error!\n${error}\n\n`);
    return res.sendStatus(500);
  }
}
