-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector" SCHEMA public;


-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT[],
    "director" TEXT NOT NULL,
    "cast" TEXT[],
    "setting" TEXT NOT NULL,
    "plot" TEXT NOT NULL,
    "embedding" vector(1536),

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);