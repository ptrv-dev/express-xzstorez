import { body } from 'express-validator';

export const createCouponeValidation = [
  body('name').isString().isLength({ min: 3, max: 256 }),
  body('coupon').isString().isLength({ min: 3, max: 64 }),
];
