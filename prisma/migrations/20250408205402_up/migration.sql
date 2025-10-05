-- CreateEnum
CREATE TYPE "DuelTier" AS ENUM ('S', 'A', 'B', 'C', 'D', 'E');

-- AlterTable
ALTER TABLE "model" ADD COLUMN     "duelTir" "DuelTier" NOT NULL DEFAULT 'D';
