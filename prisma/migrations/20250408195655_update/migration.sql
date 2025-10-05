/*
  Warnings:

  - A unique constraint covering the columns `[userId,opponentId]` on the table `DuelStat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DuelStat_userId_opponentId_key" ON "DuelStat"("userId", "opponentId");
