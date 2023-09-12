-- CreateTable
CREATE TABLE "CommunityCreator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CommunityCreator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityVod" (
    "id" SERIAL NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "communityCreatorId" INTEGER NOT NULL,

    CONSTRAINT "CommunityVod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityVodAnnotation" (
    "id" SERIAL NOT NULL,
    "note" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "communityVodId" INTEGER NOT NULL,

    CONSTRAINT "CommunityVodAnnotation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommunityVod" ADD CONSTRAINT "CommunityVod_communityCreatorId_fkey" FOREIGN KEY ("communityCreatorId") REFERENCES "CommunityCreator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityVodAnnotation" ADD CONSTRAINT "CommunityVodAnnotation_communityVodId_fkey" FOREIGN KEY ("communityVodId") REFERENCES "CommunityVod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
