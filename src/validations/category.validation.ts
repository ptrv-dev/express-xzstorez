import { body } from 'express-validator';

export const categoryCreateValidation = [
  body('title').isLength({ min: 4, max: 128 }),
];
