
UPDATE `book`SET `title` = CONCAT(`title`, ' - ', `subtitle`) WHERE `subtitle` IS NOT NULL;

-- AlterTable
ALTER TABLE `book` DROP COLUMN `subtitle`;
