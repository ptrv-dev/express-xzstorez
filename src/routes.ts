import { Express } from 'express';
import { upload } from './app';

// controllers
import * as AuthController from './controllers/auth.controller';
import * as CategoryController from './controllers/category.controller';
import * as UploadController from './controllers/upload.controller';

// middleware
import { verifyToken } from './middlewares/verifyToken';

// validations
import { loginValidation } from './validations/auth.validation';
import { categoryCreateValidation } from './validations/category.validation';

export default function (app: Express) {
  // upload routes
  app.post(
    '/upload',
    verifyToken,
    upload.single('image'),
    UploadController.uploadOne
  );
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
  app.patch(
    '/category/:id',
    verifyToken,
    categoryCreateValidation,
    CategoryController.edit
  );
  app.delete('/category/:id', verifyToken, CategoryController.removeOne);
}
