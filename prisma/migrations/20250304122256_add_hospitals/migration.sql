-- CreateEnum
CREATE TYPE "HospitalType" AS ENUM ('GENERAL', 'SPECIALIZED', 'REHABILITATION', 'PSYCHIATRIC', 'CHILDREN', 'MATERNITY');

-- CreateEnum
CREATE TYPE "Specialization" AS ENUM ('CARDIOLOGY', 'ORTHOPEDICS', 'PEDIATRICS', 'ONCOLOGY', 'RADIOLOGY', 'DERMATOLOGY', 'NEUROLOGY', 'PSYCHIATRY');

-- CreateEnum
CREATE TYPE "CaregiverRole" AS ENUM ('NURSE', 'PHYSIOTHERAPIST', 'SOCIAL_WORKER', 'HOME_AIDE', 'MIDWIFE');

-- CreateEnum
CREATE TYPE "HospitalService" AS ENUM ('EMERGENCY_CARE', 'CARDIOLOGY', 'ONCOLOGY', 'NEUROLOGY', 'PEDIATRICS', 'ORTHOPEDIC_SURGERY', 'RADIOLOGY', 'PHYSICAL_THERAPY', 'PSYCHIATRY', 'MATERNITY_CARE', 'DERMATOLOGY');

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacity" INTEGER,
    "type" "HospitalType" NOT NULL,
    "services" "HospitalService"[],
    "embedding" vector(1536),

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialization" "Specialization" NOT NULL,
    "experienceYears" INTEGER,
    "hospitalId" TEXT,
    "embedding" vector(1536),

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caregiver" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "CaregiverRole" NOT NULL,
    "experienceYears" INTEGER,
    "hospitalId" TEXT,
    "embedding" vector(1536),

    CONSTRAINT "Caregiver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_hospitalId_key" ON "Doctor"("hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "Caregiver_hospitalId_key" ON "Caregiver"("hospitalId");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;
