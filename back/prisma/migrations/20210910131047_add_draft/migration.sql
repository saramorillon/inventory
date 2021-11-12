-- CreateTable
CREATE TABLE `draft` (
    `serial` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191),
    `authors` VARCHAR(191),
    `source` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`serial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
