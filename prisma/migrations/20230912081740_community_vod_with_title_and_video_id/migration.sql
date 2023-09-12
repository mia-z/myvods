/*
  Warnings:

  - Added the required column `videoId` to the `CommunityVod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoTitle` to the `CommunityVod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunityVod" ADD COLUMN     "videoId" TEXT NOT NULL,
ADD COLUMN     "videoTitle" TEXT NOT NULL;
