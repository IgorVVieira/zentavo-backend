import 'dotenv/config';
import 'express-async-errors';
import 'module-alias/register';
import 'reflect-metadata';

import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from '@shared/config/swagger.config';
import { errorHandler } from '@shared/middlewares/error-handler';

import '@transactions/infra/container';
import '@users/infra/container';
import { userRouter } from '@users/infra/routes';

import { transactionRouter } from '@transactions/infra/routes';
import express from 'express';

import { startConsumers } from './workers';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: '*',
  }),
);
app.use('/api', userRouter);
app.use('/api', transactionRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

startConsumers()
  .then(() => {
    console.log('Consumers started');
  })
  .catch(console.error);

export { app };
