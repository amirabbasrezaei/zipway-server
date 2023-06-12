/*
  Warnings:

  - You are about to drop the column `chosenServiceTypeIndex` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `destinationCoordinates` on the `Ride` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rider" DROP CONSTRAINT "Rider_snappRideId_fkey";

-- AlterTable
ALTER TABLE "MaximRide" ADD COLUMN     "isChosen" BOOLEAN DEFAULT false,
ADD COLUMN     "maximRideId" TEXT;

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "chosenServiceTypeIndex",
DROP COLUMN "destinationCoordinates",
ALTER COLUMN "originCoordinate" SET DATA TYPE DOUBLE PRECISION[];

-- AlterTable
ALTER TABLE "Rider" ALTER COLUMN "snappRideId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SnappRide" ADD COLUMN     "isChosen" BOOLEAN DEFAULT false,
ADD COLUMN     "snappRideId" TEXT;

-- AlterTable
ALTER TABLE "TapsiRide" ADD COLUMN     "isChosen" BOOLEAN,
ADD COLUMN     "tapsiRideId" TEXT;

-- CreateTable
CREATE TABLE "DestinationCoordinate" (
    "rideId" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DestinationCoordinate_pkey" PRIMARY KEY ("rideId")
);

-- AddForeignKey
ALTER TABLE "DestinationCoordinate" ADD CONSTRAINT "DestinationCoordinate_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_snappRideId_fkey" FOREIGN KEY ("snappRideId") REFERENCES "SnappRide"("id") ON DELETE SET NULL ON UPDATE CASCADE;
