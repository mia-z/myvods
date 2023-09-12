/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `CommunityCreator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `CommunityCreator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunityCreator" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CommunityCreator_slug_key" ON "CommunityCreator"("slug");
