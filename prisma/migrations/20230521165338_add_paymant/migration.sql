/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credit" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "payment_create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_success_date" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "trackId" TEXT,
    "status" INTEGER,
    "isPayed" BOOLEAN NOT NULL DEFAULT false,
    "paymentId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
