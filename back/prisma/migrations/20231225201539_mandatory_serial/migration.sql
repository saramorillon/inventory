/*
  Warnings:

  - Made the column `serial` on table `book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `book` MODIFY `serial` VARCHAR(191) NOT NULL;
