/*
  Warnings:

  - Added the required column `userId` to the `Vod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vod" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Vod" ADD CONSTRAINT "Vod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
