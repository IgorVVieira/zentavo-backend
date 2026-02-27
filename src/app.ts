import 'dotenv/config';
import 'express-async-errors';
import 'module-alias/register';
import 'reflect-metadata';

import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from '@shared/config/swagger.config';
import { errorHandler } from '@shared/middlewares/error-handler';
import { Logger } from '@shared/utils/logger';

import '@payments/infra/container';
import '@transactions/infra/container';
import '@users/infra/container';
import { userRouter } from '@users/infra/routes';

import { paymentRouter } from '@payments/infra/routes';
import { transactionRouter } from '@transactions/infra/routes';
import express from 'express';
import { limiter } from 'rate-limit';

import { startConsumers } from './workers';

const app = express();

app.use(pinoHttp());
app.use(
  cors({
    origin: process.env.NODE_ENV === 'dev' ? '*' : process.env.FRONTEND_URL,
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(express.json());
app.use(limiter);

app.use('/api', userRouter, transactionRouter, paymentRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  Logger.info(`Server is running on port: ${process.env.PORT}`);
});

startConsumers()
  .then(() => {
    Logger.info('Consumers started');
  })
  .catch(error => {
    Logger.error('Error starting consumers:', error);
  });

export { app };
