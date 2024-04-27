-- CreateTable
CREATE TABLE `_user_to_book` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_user_to_book_AB_unique`(`A`, `B`),
    INDEX `_user_to_book_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_user_to_book` ADD CONSTRAINT `_user_to_book_A_fkey` FOREIGN KEY (`A`) REFERENCES `book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_user_to_book` ADD CONSTRAINT `_user_to_book_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
