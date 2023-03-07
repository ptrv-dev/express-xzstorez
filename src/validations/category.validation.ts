import { body } from 'express-validator';

export const categoryCreateValidation = [
  body('title').isLength({ min: 4, max: 128 }),
];

export const categoryEditValidation = [
  body('title').optional().isLength({ min: 4, max: 128 }),
];
