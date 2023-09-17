/*
  Warnings:

  - Changed the type of `provider` on the `OAuthConnection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `provider` on the `Vod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VideoService" AS ENUM ('Youtube', 'Twitch', 'Kick', 'Rumble');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('GOOGLE', 'TWITCH');

-- AlterTable
ALTER TABLE "OAuthConnection" DROP COLUMN "provider",
ADD COLUMN     "provider" "OAuthProvider" NOT NULL;

-- AlterTable
ALTER TABLE "Vod" DROP COLUMN "provider",
ADD COLUMN     "provider" "VideoService" NOT NULL;

-- DropEnum
DROP TYPE "Provider";
