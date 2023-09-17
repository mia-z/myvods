/*
  Warnings:

  - Added the required column `service` to the `CommunityVod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunityVod" ADD COLUMN     "service" "VideoService" NOT NULL;
