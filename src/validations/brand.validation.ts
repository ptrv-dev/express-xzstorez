import { body } from 'express-validator';

export const brandCreateValidation = [
  body('image').isString(),
  body('title').isLength({ min: 3, max: 128 }),
];
export const brandEditValidation = [
  body('image').optional().isString(),
  body('title').optional().isLength({ min: 3, max: 128 }),
];
