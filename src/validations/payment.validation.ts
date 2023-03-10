import { body } from 'express-validator';

export const orderCreateValidation = [body('session_id').isString()];
