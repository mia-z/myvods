/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `videoThumbUrl` to the `CommunityVod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunityVod" ADD COLUMN     "videoThumbUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "Image";
