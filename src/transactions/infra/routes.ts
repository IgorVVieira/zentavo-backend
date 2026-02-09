import multer from 'multer';

import { authMiddleware } from '@shared/middlewares/auth';

import { CategoryController } from '@transactions/controllers/category.controller';
import { DashboardController } from '@transactions/controllers/dashboard.controller';
import { Router } from 'express';

import { container } from './container';
import { TransactionController } from '../controllers/transaction.controller';

const transactionController = container.resolve(TransactionController);
const categoryController = container.resolve(CategoryController);
const dashboardController = container.resolve(DashboardController);

const transactionRouter = Router();

transactionRouter.post(
  '/transactions/import',
  authMiddleware,
  multer().single('statement'),
  (req, res) => transactionController.importOfx(req, res),
);

// Dashboard routes with specific paths must come before parameterized routes
transactionRouter.get('/transactions/dashboard/last-six-months', authMiddleware, (req, res) =>
  dashboardController.listByLastSixMonths(req, res),
);

transactionRouter.put('/transactions/:id', authMiddleware, (req, res) =>
  transactionController.update(req, res),
);
transactionRouter.get('/transactions/:month/:year', authMiddleware, (req, res) =>
  transactionController.getTransactionsByDate(req, res),
);

transactionRouter.post('/categories', authMiddleware, (req, res) =>
  categoryController.create(req, res),
);
transactionRouter.put('/categories/:id', authMiddleware, (req, res) =>
  categoryController.update(req, res),
);
transactionRouter.get('/categories', authMiddleware, (req, res) =>
  categoryController.list(req, res),
);
transactionRouter.delete('/categories/:id', authMiddleware, (req, res) =>
  categoryController.delete(req, res),
);

transactionRouter.post(
  '/transactions/dashboard/payment-methods/:month/:year',
  authMiddleware,
  (req, res) => dashboardController.listByPaymentMethod(req, res),
);
transactionRouter.put(
  '/transactions/dashboard/categories/:month/:year/:transactionType',
  authMiddleware,
  (req, res) => dashboardController.listByCategory(req, res),
);
transactionRouter.delete('/transactions/dashboard/:id', authMiddleware, (req, res) =>
  categoryController.delete(req, res),
);

export { transactionRouter };
