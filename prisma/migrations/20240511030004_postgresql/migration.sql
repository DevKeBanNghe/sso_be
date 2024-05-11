/*
  Warnings:

  - Added the required column `webpage_key` to the `Webpage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Webpage" ADD COLUMN     "webpage_key" TEXT NOT NULL;
