-- CreateTable
CREATE TABLE "TestMovie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT[],
    "director" TEXT NOT NULL,
    "cast" TEXT[],
    "setting" TEXT NOT NULL,
    "plot" TEXT NOT NULL,

    CONSTRAINT "TestMovie_pkey" PRIMARY KEY ("id")
);
