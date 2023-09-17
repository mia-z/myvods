/*
  Warnings:

  - Changed the type of `timestamp` on the `CommunityVodAnnotation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CommunityVodAnnotation" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" INTEGER NOT NULL;
