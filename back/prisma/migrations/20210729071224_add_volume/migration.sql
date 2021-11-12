-- CreateTable
CREATE TABLE `volume` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serieId` INTEGER NOT NULL,
    `index` INTEGER NOT NULL DEFAULT 1,
    `subtitle` VARCHAR(191),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_author_to_serie` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_author_to_serie_AB_unique`(`A`, `B`),
    INDEX `_author_to_serie_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `volume` ADD FOREIGN KEY (`serieId`) REFERENCES `serie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_author_to_serie` ADD FOREIGN KEY (`A`) REFERENCES `author`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_author_to_serie` ADD FOREIGN KEY (`B`) REFERENCES `serie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
