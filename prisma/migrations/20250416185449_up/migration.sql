-- DropForeignKey
ALTER TABLE "DuelStat" DROP CONSTRAINT "DuelStat_opponentId_fkey";

-- AddForeignKey
ALTER TABLE "DuelStat" ADD CONSTRAINT "DuelStat_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
