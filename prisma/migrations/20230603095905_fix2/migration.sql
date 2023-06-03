/*
  Warnings:

  - You are about to drop the column `destinationCoordinate` on the `Ride` table. All the data in the column will be lost.
  - The `originCoordinate` column on the `Ride` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `price` to the `MaximRide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `SnappRide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `TapsiRide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RideStatus" ADD VALUE 'NOT_INITIATED';

-- DropIndex
DROP INDEX "MaximRide_rideId_key";

-- DropIndex
DROP INDEX "SnappRide_rideId_key";

-- DropIndex
DROP INDEX "TapsiRide_rideId_key";

-- AlterTable
ALTER TABLE "MaximRide" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "destinationCoordinate",
ADD COLUMN     "destinationCoordinates" INTEGER[],
DROP COLUMN "originCoordinate",
ADD COLUMN     "originCoordinate" INTEGER[],
ALTER COLUMN "numberOfPassengers" DROP NOT NULL,
ALTER COLUMN "chosenServiceProvider" DROP NOT NULL,
ALTER COLUMN "commission" DROP NOT NULL,
ALTER COLUMN "finalPrice" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SnappRide" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TapsiRide" ADD COLUMN     "price" INTEGER NOT NULL;
