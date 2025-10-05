-- CreateTable
CREATE TABLE "DuelStat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    "totalMatches" INTEGER NOT NULL,
    "wins" INTEGER NOT NULL,

    CONSTRAINT "DuelStat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DuelStat" ADD CONSTRAINT "DuelStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DuelStat" ADD CONSTRAINT "DuelStat_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
