/*
  Warnings:

  - Changed the type of `provider` on the `OAuthConnection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `serviceIdProvider` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('GOOGLE', 'TWITCH');

-- AlterTable
ALTER TABLE "OAuthConnection" DROP COLUMN "provider",
ADD COLUMN     "provider" "Provider" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "serviceIdProvider",
ADD COLUMN     "serviceIdProvider" "Provider" NOT NULL;

-- DropEnum
DROP TYPE "OAuthProvider";

-- CreateTable
CREATE TABLE "Vod" (
    "id" SERIAL NOT NULL,
    "provider" "Provider" NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Vod_pkey" PRIMARY KEY ("id")
);
