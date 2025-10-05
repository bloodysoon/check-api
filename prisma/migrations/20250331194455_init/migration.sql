-- CreateTable
CREATE TABLE "model" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "wife" INTEGER NOT NULL DEFAULT 0,
    "brest" INTEGER NOT NULL DEFAULT 0,
    "ass" INTEGER NOT NULL DEFAULT 0,
    "face" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "averageRating" INTEGER NOT NULL DEFAULT 0,
    "overall" INTEGER NOT NULL DEFAULT 0,
    "content" INTEGER NOT NULL DEFAULT 0,
    "body" INTEGER NOT NULL DEFAULT 0,
    "hair" INTEGER NOT NULL DEFAULT 0,
    "nipples" INTEGER NOT NULL DEFAULT 0,
    "legs" INTEGER NOT NULL DEFAULT 0,
    "pussy" INTEGER NOT NULL DEFAULT 0,
    "Final" INTEGER NOT NULL DEFAULT 0,
    "Quarterfinals" INTEGER NOT NULL DEFAULT 0,
    "Semifinals" INTEGER NOT NULL DEFAULT 0,
    "winner" INTEGER NOT NULL DEFAULT 0,
    "winStreak" INTEGER NOT NULL DEFAULT 0,
    "duelLose" INTEGER NOT NULL DEFAULT 0,
    "duelWin" INTEGER NOT NULL DEFAULT 0,
    "duelRating" INTEGER NOT NULL DEFAULT 0,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "onlineCount" INTEGER NOT NULL DEFAULT 0,
    "videoCount" INTEGER NOT NULL DEFAULT 0,
    "instagram" TEXT,
    "tiktok" TEXT,
    "videoid" VARCHAR(2048),

    CONSTRAINT "model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "modelId" INTEGER NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
