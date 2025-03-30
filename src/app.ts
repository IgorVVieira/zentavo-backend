import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { HttpStatus } from '@shared/http-status.enum';

import { router } from './routes';
import { swaggerDocument } from './swagger';

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/healthcheck', (req, res) => {
  res.status(HttpStatus.OK).json({ message: 'OK' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

export { app };
