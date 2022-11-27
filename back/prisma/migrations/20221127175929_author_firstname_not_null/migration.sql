/*
  Warnings:

  - Made the column `firstName` on table `author` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `author` MODIFY `firstName` VARCHAR(191) NOT NULL DEFAULT '';

-- RenameIndex
ALTER TABLE `author` RENAME INDEX `author.firstName_lastName_unique` TO `author_firstName_lastName_key`;

-- RenameIndex
ALTER TABLE `book` RENAME INDEX `book.serial_unique` TO `book_serial_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user.username_unique` TO `user_username_key`;
