/*
  Warnings:

  - You are about to drop the column `author` on the `book` table. All the data in the column will be lost.
  - Added the required column `authors` to the `book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` DROP COLUMN `author`,
    ADD COLUMN `authors` VARCHAR(191) NOT NULL,
    ADD COLUMN `source` VARCHAR(191) NOT NULL;
