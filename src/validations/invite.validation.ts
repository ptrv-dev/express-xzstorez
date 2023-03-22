import { body } from 'express-validator';

export const inviteSendValidation = [
  body('name').isString().isLength({ min: 2, max: 256 }),
  body('email').isEmail(),
  body('invites').isArray(),
];
