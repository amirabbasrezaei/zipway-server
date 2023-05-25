/*
  Warnings:

  - A unique constraint covering the columns `[trackId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentUrl" TEXT,
ALTER COLUMN "servicePaymentId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_trackId_key" ON "Payment"("trackId");
