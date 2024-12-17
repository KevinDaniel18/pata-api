/*
  Warnings:

  - Added the required column `description` to the `AdoptionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdoptionRequest" ADD COLUMN     "description" TEXT NOT NULL;
