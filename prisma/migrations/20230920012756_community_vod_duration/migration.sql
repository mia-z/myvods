/*
  Warnings:

  - Added the required column `duration` to the `CommunityVod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunityVod" ADD COLUMN     "duration" TEXT NOT NULL;
