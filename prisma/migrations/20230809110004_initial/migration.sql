-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('GOOGLE', 'TWITCH');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "serviceId" TEXT NOT NULL,
    "serviceIdProvider" "OAuthProvider" NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OAuthConnection" (
    "id" SERIAL NOT NULL,
    "authCode" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" "OAuthProvider" NOT NULL,

    CONSTRAINT "OAuthConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_serviceId_key" ON "User"("serviceId");

-- AddForeignKey
ALTER TABLE "OAuthConnection" ADD CONSTRAINT "OAuthConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
