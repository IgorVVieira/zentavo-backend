import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { HttpStatus } from '@shared/http-status.enum';
import { errorHandler } from '@shared/middlewares/error-handler';

import { userRouter } from '@users/infra/routes';

import { transactionRouter } from '@transactions/infra/routes';
import express from 'express';

import { swaggerDocument } from './swagger';

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/healthcheck', (req, res) => {
  res.status(HttpStatus.OK).json({ message: 'OK' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);

app.use(errorHandler);

export { app };
