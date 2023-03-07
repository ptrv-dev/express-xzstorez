import { Express } from 'express';

// controllers
import * as AuthController from './controllers/auth.controller';

// validations
import { loginValidation } from './validations/auth.validation';

export default function (app: Express) {
  app.post('/auth/login', loginValidation, AuthController.login);
}
