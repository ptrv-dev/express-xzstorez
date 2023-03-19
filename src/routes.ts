import { Express } from 'express';
import { upload } from './app';

// controllers
import * as AuthController from './controllers/auth.controller';
import * as CategoryController from './controllers/category.controller';
import * as UploadController from './controllers/upload.controller';
import * as BrandController from './controllers/brand.controller';
import * as ProductController from './controllers/product.controller';
import * as PaymentStripeController from './controllers/payment.stripe.controller';
import * as CouponController from './controllers/coupon.controller';

// middleware
import { verifyToken } from './middlewares/verifyToken';

// validations
import { loginValidation } from './validations/auth.validation';
import {
  categoryCreateValidation,
  categoryEditValidation,
} from './validations/category.validation';
import {
  brandCreateValidation,
  brandEditValidation,
} from './validations/brand.validation';
import {
  productCreateValidation,
  productEditValidation,
} from './validations/product.validation';
import { orderCreateValidation } from './validations/payment.validation';
import {
  createCouponValidation,
  editCouponValidation,
} from './validations/coupon.validation';

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
  app.get('/auth/check', verifyToken, AuthController.check);
  // category routes
  app.get('/category', CategoryController.getAll);
  app.get('/category/:id', CategoryController.getOne);
  app.post(
    '/category',
    verifyToken,
    categoryCreateValidation,
    CategoryController.create
  );
  app.patch(
    '/category/:id',
    verifyToken,
    categoryEditValidation,
    CategoryController.edit
  );
  app.delete('/category/:id', verifyToken, CategoryController.removeOne);
  // brand routes
  app.get('/brand', BrandController.getAll);
  app.get('/brand/:id', BrandController.getOne);
  app.post(
    '/brand',
    verifyToken,
    brandCreateValidation,
    BrandController.create
  );
  app.delete('/brand/:id', verifyToken, BrandController.removeOne);
  app.patch(
    '/brand/:id',
    verifyToken,
    brandEditValidation,
    BrandController.edit
  );
  // product routes
  app.get('/product', ProductController.getAll);
  app.get('/product/:id', ProductController.getOne);
  app.post(
    '/product',
    verifyToken,
    productCreateValidation,
    ProductController.create
  );
  app.delete('/product/:id', verifyToken, ProductController.removeOne);
  app.patch(
    '/product/:id',
    verifyToken,
    productEditValidation,
    ProductController.edit
  );
  // payment
  app.post('/payment', PaymentStripeController.create);
  app.get('/payment', PaymentStripeController.get);
  app.post(
    '/order',
    orderCreateValidation,
    PaymentStripeController.createOrder
  );
  app.get('/order/:id', PaymentStripeController.track);
  // coupon
  app.post(
    '/coupon',
    verifyToken,
    createCouponValidation,
    CouponController.create
  );
  app.get('/coupon', verifyToken, CouponController.getAll);
  app.get('/coupon/:id', verifyToken, CouponController.getOne);
  app.get('/coupon/find', CouponController.findOne);
  app.patch(
    '/coupon/:id',
    verifyToken,
    editCouponValidation,
    CouponController.edit
  );
  app.delete('/coupon/:id', verifyToken, CouponController.removeOne);
}
