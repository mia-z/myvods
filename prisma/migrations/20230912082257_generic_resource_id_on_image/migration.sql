/*
  Warnings:

  - You are about to drop the column `vodId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `resourceId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_vodId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "vodId",
ADD COLUMN     "resourceId" INTEGER NOT NULL;
