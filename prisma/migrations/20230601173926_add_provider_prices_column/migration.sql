/*
  Warnings:

  - You are about to drop the column `maximPrice` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `snappPrice` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `tapsiPrice` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `finalPrice` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "maximPrice",
DROP COLUMN "price",
DROP COLUMN "snappPrice",
DROP COLUMN "tapsiPrice",
ADD COLUMN     "chosenServiceTypeIndex" INTEGER,
ADD COLUMN     "finalPrice" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "maximRideId" TEXT;

-- CreateTable
CREATE TABLE "MaximRide" (
    "id" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "rideId" TEXT NOT NULL,

    CONSTRAINT "MaximRide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MaximRide_rideId_key" ON "MaximRide"("rideId");

-- AddForeignKey
ALTER TABLE "MaximRide" ADD CONSTRAINT "MaximRide_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_maximRideId_fkey" FOREIGN KEY ("maximRideId") REFERENCES "MaximRide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
