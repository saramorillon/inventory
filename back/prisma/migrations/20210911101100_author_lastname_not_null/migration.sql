/*
  Warnings:

  - Made the column `lastName` on table `author` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `author` MODIFY `lastName` VARCHAR(191) NOT NULL;
