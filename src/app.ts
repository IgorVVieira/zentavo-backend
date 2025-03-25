import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';

const app = express();

app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
  res.send('Hello World');
});
