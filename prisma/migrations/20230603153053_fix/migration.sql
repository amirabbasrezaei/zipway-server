/*
  Warnings:

  - Added the required column `price` to the `MaximRide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `SnappRide` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `TapsiRide` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "MaximRide" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SnappRide" ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TapsiRide" ADD COLUMN     "price" INTEGER NOT NULL;
