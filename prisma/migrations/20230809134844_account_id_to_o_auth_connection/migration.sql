/*
  Warnings:

  - Added the required column `accountId` to the `OAuthConnection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OAuthConnection" ADD COLUMN     "accountId" TEXT NOT NULL;
