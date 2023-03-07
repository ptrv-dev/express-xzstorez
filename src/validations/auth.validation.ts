import { body } from 'express-validator';

export const loginValidation = [
  body('username').isLength({ min: 4, max: 64 }),
  body('password').isLength({ min: 8, max: 64 }),
];
