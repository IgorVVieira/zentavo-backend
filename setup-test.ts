import { execSync } from 'child_process';

export const setupTestDB = async (): Promise<void> => {
  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
};
