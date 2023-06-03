
-- CreateEnum
CREATE TYPE "RideServiceProvider" AS ENUM ('SNAPP', 'TAPSI', 'MAXIM');

-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "originCoordinate" INTEGER[],
    "destinationCoordinates" INTEGER[],
    "finalPrice" INTEGER,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishDate" TIMESTAMP(3),
    "originDescription" TEXT NOT NULL,
    "destinationDescription" TEXT NOT NULL,
    "numberOfPassengers" INTEGER,
    "chosenServiceProvider" "RideServiceProvider",
    "chosenServiceTypeIndex" INTEGER,
    "Status" "RideStatus" NOT NULL,
    "commission" INTEGER,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnappRide" (
    "id" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "rideId" TEXT NOT NULL,

    CONSTRAINT "SnappRide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaximRide" (
    "id" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "rideId" TEXT NOT NULL,

    CONSTRAINT "MaximRide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TapsiRide" (
    "id" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "categoryType" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "rideId" TEXT NOT NULL,

    CONSTRAINT "TapsiRide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "snappRideId" TEXT NOT NULL,
    "tapsiRideId" TEXT,
    "maximRideId" TEXT,

    CONSTRAINT "Rider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "platePartA" INTEGER NOT NULL,
    "platePartB" INTEGER NOT NULL,
    "plateCcharacter" TEXT NOT NULL,
    "plateProvinceCode" INTEGER NOT NULL,
    "plateImageUrl" TEXT,
    "color" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RideToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_riderId_key" ON "Car"("riderId");

-- CreateIndex
CREATE UNIQUE INDEX "_RideToUser_AB_unique" ON "_RideToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RideToUser_B_index" ON "_RideToUser"("B");

-- AddForeignKey
ALTER TABLE "SnappRide" ADD CONSTRAINT "SnappRide_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaximRide" ADD CONSTRAINT "MaximRide_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TapsiRide" ADD CONSTRAINT "TapsiRide_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_snappRideId_fkey" FOREIGN KEY ("snappRideId") REFERENCES "SnappRide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_tapsiRideId_fkey" FOREIGN KEY ("tapsiRideId") REFERENCES "TapsiRide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_maximRideId_fkey" FOREIGN KEY ("maximRideId") REFERENCES "MaximRide"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RideToUser" ADD CONSTRAINT "_RideToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RideToUser" ADD CONSTRAINT "_RideToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
