import 'dotenv/config';
import 'express-async-errors';
import 'module-alias/register';
import 'reflect-metadata';

import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
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

import { startConsumers } from './workers';

const limiter = rateLimit({
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

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
  .catch(console.error);

export { app };
