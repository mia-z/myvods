/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `CommunityVod` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CommunityVod_videoId_key" ON "CommunityVod"("videoId");
