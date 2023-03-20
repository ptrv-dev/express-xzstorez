import { body } from 'express-validator';

export const sellixOrderCreateValidation = [
  body('email').isString(),
  body('fullName').isString().isLength({ min: 4, max: 128 }),
  body('country').isString().isLength({ min: 2 }),
  body('address').isString().isLength({ min: 2 }),
  body('city').isString().isLength({ min: 2 }),
  body('state').isString().isLength({ min: 2 }),
  body('phoneNumber').isString(),
];
