-- AlterTable
ALTER TABLE "CommunityCreator" ADD COLUMN     "imageLink" TEXT;

-- CreateTable
CREATE TABLE "CommunityContributor" (
    "id" SERIAL NOT NULL,
    "nick" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "CommunityContributor_pkey" PRIMARY KEY ("id")
);
