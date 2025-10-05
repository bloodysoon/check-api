-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_modelId_fkey";

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
