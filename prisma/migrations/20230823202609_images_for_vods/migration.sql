-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('THUMBNAIL', 'COVER', 'DEFAULT');

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "type" "ImageType" NOT NULL,
    "vodId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_vodId_fkey" FOREIGN KEY ("vodId") REFERENCES "Vod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
