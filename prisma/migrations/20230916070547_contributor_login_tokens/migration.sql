/*
  Warnings:

  - You are about to drop the column `token` on the `CommunityContributor` table. All the data in the column will be lost.
  - Added the required column `password` to the `CommunityContributor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommunityContributor" DROP COLUMN "token",
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ContributorToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "contributorID" INTEGER NOT NULL,

    CONSTRAINT "ContributorToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContributorToken" ADD CONSTRAINT "ContributorToken_contributorID_fkey" FOREIGN KEY ("contributorID") REFERENCES "CommunityContributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
