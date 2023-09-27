-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('THUMBNAIL', 'COVER', 'DEFAULT');

-- CreateEnum
CREATE TYPE "VideoService" AS ENUM ('Youtube', 'Twitch', 'Kick', 'Rumble');

-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('GOOGLE', 'TWITCH');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LoginToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthConnection" (
    "id" SERIAL NOT NULL,
    "accountId" TEXT NOT NULL,
    "authCode" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" "OAuthProvider" NOT NULL,

    CONSTRAINT "OAuthConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vod" (
    "id" SERIAL NOT NULL,
    "provider" "VideoService" NOT NULL,
    "link" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Vod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributorToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "contributorID" INTEGER NOT NULL,

    CONSTRAINT "ContributorToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityContributor" (
    "id" SERIAL NOT NULL,
    "nick" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "power" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "CommunityContributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityCreator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageLink" TEXT,
    "description" TEXT,

    CONSTRAINT "CommunityCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityVod" (
    "id" SERIAL NOT NULL,
    "service" "VideoService" NOT NULL,
    "videoSource" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "videoThumbUrl" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "dateRecorded" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "communityCreatorId" INTEGER NOT NULL,

    CONSTRAINT "CommunityVod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityVodAnnotation" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "subject" TEXT,
    "game" TEXT,
    "timestamp" INTEGER NOT NULL,
    "communityVodId" INTEGER NOT NULL,

    CONSTRAINT "CommunityVodAnnotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CommunityContributorToCommunityCreator" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunityCreator_slug_key" ON "CommunityCreator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityVod_videoId_key" ON "CommunityVod"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityContributorToCommunityCreator_AB_unique" ON "_CommunityContributorToCommunityCreator"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityContributorToCommunityCreator_B_index" ON "_CommunityContributorToCommunityCreator"("B");

-- AddForeignKey
ALTER TABLE "LoginToken" ADD CONSTRAINT "LoginToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OAuthConnection" ADD CONSTRAINT "OAuthConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vod" ADD CONSTRAINT "Vod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributorToken" ADD CONSTRAINT "ContributorToken_contributorID_fkey" FOREIGN KEY ("contributorID") REFERENCES "CommunityContributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityVod" ADD CONSTRAINT "CommunityVod_communityCreatorId_fkey" FOREIGN KEY ("communityCreatorId") REFERENCES "CommunityCreator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityVodAnnotation" ADD CONSTRAINT "CommunityVodAnnotation_communityVodId_fkey" FOREIGN KEY ("communityVodId") REFERENCES "CommunityVod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityContributorToCommunityCreator" ADD CONSTRAINT "_CommunityContributorToCommunityCreator_A_fkey" FOREIGN KEY ("A") REFERENCES "CommunityContributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityContributorToCommunityCreator" ADD CONSTRAINT "_CommunityContributorToCommunityCreator_B_fkey" FOREIGN KEY ("B") REFERENCES "CommunityCreator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
