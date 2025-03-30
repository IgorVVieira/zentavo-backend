// import 'dotenv/config';
import 'reflect-metadata';
import dotenv from 'dotenv';

import { setupTestDB } from './setup-test';

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  process.exit(0);
});
