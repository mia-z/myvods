/*
  Warnings:

  - You are about to drop the column `serviceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `serviceIdProvider` on the `User` table. All the data in the column will be lost.
  - Added the required column `identifier` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_serviceId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "serviceId",
DROP COLUMN "serviceIdProvider",
ADD COLUMN     "identifier" TEXT NOT NULL;
