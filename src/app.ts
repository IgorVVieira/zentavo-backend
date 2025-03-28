import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';

import { router } from './routes';

const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
