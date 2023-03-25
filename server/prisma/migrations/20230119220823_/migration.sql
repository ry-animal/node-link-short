/*
  Warnings:

  - The primary key for the `url` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[slug,url]` on the table `url` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `id` on the `url` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "url" DROP CONSTRAINT "url_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "url_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "url_slug_url_key" ON "url"("slug", "url");
