-- DropForeignKey
ALTER TABLE "DuelStat" DROP CONSTRAINT "DuelStat_userId_fkey";

-- AddForeignKey
ALTER TABLE "DuelStat" ADD CONSTRAINT "DuelStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
