import { authMiddleware } from '@shared/middlewares/auth';

import { PaymentController } from '@payments/controllers/payment.controller';
import { ProductsController } from '@payments/controllers/products.controller';
import { Router } from 'express';

import { container } from './container';

const paymentController = container.resolve(PaymentController);
const productsController = container.resolve(ProductsController);

const paymentRouter = Router();

paymentRouter.post('/payments/link', authMiddleware, (req, res) =>
  paymentController.create(req, res),
);

paymentRouter.get('/products', (req, res) => productsController.listProducts(req, res));

export { paymentRouter };
