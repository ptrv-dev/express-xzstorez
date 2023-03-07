import { body } from 'express-validator';

export const productCreateValidation = [
  body('images').isArray(),
  body('title').isLength({ min: 3, max: 256 }),
  body('description').optional().isLength({ min: 3, max: 4096 }),
  body('category').optional().isString(),
  body('brand').optional().isString(),
  body('sizes').optional().isArray(),
  body('price').isFloat({ min: 0, max: 999999 }),
];

export const productEditValidation = [
  body('images').optional().isArray(),
  body('title').optional().isLength({ min: 3, max: 256 }),
  body('description').optional().isLength({ min: 3, max: 4096 }),
  body('category').optional().isString(),
  body('brand').optional().isString(),
  body('sizes').optional().isArray(),
  body('price').optional().isFloat({ min: 0, max: 999999 }),
];
