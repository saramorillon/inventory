-- DropForeignKey
ALTER TABLE `_author_to_serie` DROP FOREIGN KEY `_author_to_serie_ibfk_1`;
-- DropForeignKey
ALTER TABLE `_author_to_serie` DROP FOREIGN KEY `_author_to_serie_ibfk_2`;
-- DropForeignKey
ALTER TABLE `volume` DROP FOREIGN KEY `volume_ibfk_1`;
-- AlterTable
ALTER TABLE `book` DROP COLUMN `authors`,
  ADD COLUMN `subtitle` VARCHAR(191),
  MODIFY `title` VARCHAR(191) NOT NULL;
-- DropTable
DROP TABLE `_author_to_serie`;
-- DropTable
DROP TABLE `serie`;
-- DropTable
DROP TABLE `volume`;
-- CreateTable
CREATE TABLE `_author_to_book` (
  `A` INTEGER NOT NULL,
  `B` INTEGER NOT NULL,
  UNIQUE INDEX `_author_to_book_AB_unique`(`A`, `B`),
  INDEX `_author_to_book_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- AddForeignKey
ALTER TABLE `_author_to_book`
ADD FOREIGN KEY (`A`) REFERENCES `author`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE `_author_to_book`
ADD FOREIGN KEY (`B`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;