import { body } from 'express-validator';

export const brandCreateValidation = [
  body('image').isString(),
  body('title').isLength({ min: 3, max: 128 }),
];
