/*
  Warnings:

  - You are about to drop the `_authortobook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_authortobook` DROP FOREIGN KEY `_authortobook_ibfk_1`;

-- DropForeignKey
ALTER TABLE `_authortobook` DROP FOREIGN KEY `_authortobook_ibfk_2`;

-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `book_ibfk_1`;

-- DropTable
DROP TABLE `_authortobook`;

-- DropTable
DROP TABLE `book`;
