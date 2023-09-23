/*
  Warnings:

  - Made the column `videoSource` on table `CommunityVod` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CommunityVod" ALTER COLUMN "videoSource" SET NOT NULL;
