-- AlterTable
ALTER TABLE "CommunityCreator" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "_CommunityContributorToCommunityCreator" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityContributorToCommunityCreator_AB_unique" ON "_CommunityContributorToCommunityCreator"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityContributorToCommunityCreator_B_index" ON "_CommunityContributorToCommunityCreator"("B");

-- AddForeignKey
ALTER TABLE "_CommunityContributorToCommunityCreator" ADD CONSTRAINT "_CommunityContributorToCommunityCreator_A_fkey" FOREIGN KEY ("A") REFERENCES "CommunityContributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommunityContributorToCommunityCreator" ADD CONSTRAINT "_CommunityContributorToCommunityCreator_B_fkey" FOREIGN KEY ("B") REFERENCES "CommunityCreator"("id") ON DELETE CASCADE ON UPDATE CASCADE;
