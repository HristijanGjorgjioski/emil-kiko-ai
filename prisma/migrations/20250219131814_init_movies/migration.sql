-- CreateExtensionSchema
CREATE SCHEMA IF NOT EXISTS "extension";

-- make usable by everyone
GRANT usage ON SCHEMA extension TO public;
GRANT execute ON all functions IN SCHEMA extension TO public;
ALTER default privileges IN SCHEMA extension
    GRANT execute ON functions TO public;
ALTER default privileges IN SCHEMA extension
    GRANT usage ON types TO public;

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector" SCHEMA extension;

-- set search_path for this session
SET search_path = public,extension;

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT[],
    "director" TEXT NOT NULL,
    "cast" TEXT[],
    "setting" TEXT NOT NULL,
    "plot" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);