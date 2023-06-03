/*
  Warnings:

  - You are about to drop the column `destinationCoordinates` on the `Ride` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "destinationCoordinate",
ADD COLUMN     "destinationCoordinates" INTEGER[];
