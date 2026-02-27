import { container } from 'tsyringe';

import { authMiddleware } from '@shared/middlewares/auth';

import { UserController } from '@users/controllers/user.controller';

import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller';

const authController = container.resolve(AuthController);
const userController = container.resolve(UserController);

const userRouter = Router();

userRouter.post('/auth/login', (req, res) => authController.login(req, res));
userRouter.post('/auth/forgot-password', (req, res) =>
  authController.sendRecoveryPasswordToken(req, res),
);
userRouter.post('/auth/validate-token', (req, res) => authController.validateToken(req, res));
userRouter.post('/auth/reset-password', (req, res) => authController.resetPassword(req, res));

userRouter.get('/users/me', authMiddleware, (req, res) => userController.getMe(req, res));
userRouter.post('/users/create', (req, res) => userController.create(req, res));

export { userRouter };
