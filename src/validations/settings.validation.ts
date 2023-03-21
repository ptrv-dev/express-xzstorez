import { body } from 'express-validator';

export const settingsSetValidation = [
  body('cryptoDiscount').optional().isFloat({ min: 0, max: 99.99 }),
];
