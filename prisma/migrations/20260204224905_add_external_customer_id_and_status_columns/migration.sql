-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "external_customerId" UUID;
