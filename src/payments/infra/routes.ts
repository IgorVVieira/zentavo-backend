import { authMiddleware } from '@shared/middlewares/auth';

import { PaymentController } from '@payments/controllers/payment.controller';
import { ProductsController } from '@payments/controllers/products.controller';
import { SubscriptionController } from '@payments/controllers/subscription.controller';
import { Router } from 'express';

import { container } from './container';

const paymentController = container.resolve(PaymentController);
const productsController = container.resolve(ProductsController);
const subscriptionController = container.resolve(SubscriptionController);

const paymentRouter = Router();

paymentRouter.post('/payments/link', authMiddleware, (req, res) =>
  paymentController.create(req, res),
);

paymentRouter.post('/payments/billing-paid', (req, res) =>
  paymentController.billingPaidReceived(req, res),
);

paymentRouter.get('/products', (req, res) => productsController.listProducts(req, res));

paymentRouter.get('/subscriptions', authMiddleware, (req, res) =>
  paymentController.listUserSubscriptions(req, res),
);

paymentRouter.get('/subscriptions/active', authMiddleware, (req, res) =>
  subscriptionController.hasSubscription(req, res),
);

export { paymentRouter };
