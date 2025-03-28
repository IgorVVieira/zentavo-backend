import { Router } from 'express';

import { container } from '@users/infra/di/container';

import { UserController } from './users/infra/controllers/user.controller';

const router = Router();

const userController = container.resolve(UserController);

router.post('/users', userController.create);

export { router };
