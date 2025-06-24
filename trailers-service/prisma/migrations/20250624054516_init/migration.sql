-- CreateEnum
CREATE TYPE "trailer_types" AS ENUM ('DRY_VAN', 'REEFER', 'FLATBED', 'TANKER', 'LOWBOY', 'STEP_DECK', 'OTHER');

-- CreateEnum
CREATE TYPE "trailer_statuses" AS ENUM ('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "ownership_types" AS ENUM ('OWNED', 'LEASED', 'RENTED');

-- CreateTable
CREATE TABLE "trailers" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trailerId" TEXT NOT NULL,
    "trailerType" TEXT NOT NULL DEFAULT 'dry_van',
    "year" INTEGER,
    "vin" TEXT,
    "color" TEXT,
    "length" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "capacity" INTEGER,
    "axleCount" INTEGER,
    "ownershipType" TEXT DEFAULT 'owned',
    "purchaseDate" TIMESTAMP(3),
    "leaseEndDate" TIMESTAMP(3),
    "purchasePrice" DECIMAL(65,30),
    "licensePlate" TEXT,
    "issuingState" TEXT,
    "registrationExp" TIMESTAMP(3),
    "insurancePolicy" TEXT,
    "insuranceExp" TIMESTAMP(3),
    "jurisdiction" TEXT DEFAULT 'IFTA',
    "gvwr" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'available',
    "assignedYard" TEXT,
    "currentLocation" TEXT,
    "attachedTruckId" TEXT,
    "titleDoc" TEXT,
    "leaseDoc" TEXT,
    "registrationDoc" TEXT,
    "insuranceDoc" TEXT,
    "inspectionDoc" TEXT,

    CONSTRAINT "trailers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trailers_trailerId_key" ON "trailers"("trailerId");

-- CreateIndex
CREATE UNIQUE INDEX "trailers_vin_key" ON "trailers"("vin");
