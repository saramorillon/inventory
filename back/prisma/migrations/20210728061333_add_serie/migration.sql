-- AlterTable
ALTER TABLE `book` ADD COLUMN `serieId` INTEGER;

-- CreateTable
CREATE TABLE `serie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `serie.name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `book` ADD FOREIGN KEY (`serieId`) REFERENCES `serie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
