import { Express } from 'express';

// controllers
import * as AuthController from './controllers/auth.controller';
import * as CategoryController from './controllers/category.controller';

// middleware
import { verifyToken } from './middlewares/verifyToken';

// validations
import { loginValidation } from './validations/auth.validation';
import { categoryCreateValidation } from './validations/category.validation';

export default function (app: Express) {
  // auth routes
  app.post('/auth/login', loginValidation, AuthController.login);
  // category routes
  app.get('/category', CategoryController.getAll);
  app.post(
    '/category',
    verifyToken,
    categoryCreateValidation,
    CategoryController.create
  );
}
