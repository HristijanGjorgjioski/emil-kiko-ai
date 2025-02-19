/*
  Warnings:

  - You are about to drop the `TestMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "embedding" DROP NOT NULL;

-- DropTable
DROP TABLE "TestMovie";
