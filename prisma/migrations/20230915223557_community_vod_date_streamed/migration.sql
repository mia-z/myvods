/*
  Warnings:

  - Added the required column `dateRecorded` to the `CommunityVod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunityVod" ADD COLUMN     "dateRecorded" TEXT NOT NULL;
