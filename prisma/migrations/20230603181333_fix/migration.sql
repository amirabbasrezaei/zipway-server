/*
  Warnings:

  - The `originCoordinate` column on the `Ride` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "MaximRide_rideId_key";

-- DropIndex
DROP INDEX "SnappRide_rideId_key";

-- DropIndex
DROP INDEX "TapsiRide_rideId_key";

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "originCoordinate",
ADD COLUMN     "originCoordinate" INTEGER[];
