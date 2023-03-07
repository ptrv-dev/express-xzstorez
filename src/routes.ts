import { Express } from 'express';

// controllers
import * as AuthController from './controllers/auth.controller';

// middleware
import { verifyToken } from './middlewares/verifyToken';

// validations
import { loginValidation } from './validations/auth.validation';

export default function (app: Express) {
  app.post('/auth/login', loginValidation, AuthController.login);
}
