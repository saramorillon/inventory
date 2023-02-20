-- AlterTable
ALTER TABLE `user` MODIFY `username` VARCHAR(40) NOT NULL,
    MODIFY `password` CHAR(56) NOT NULL,
    MODIFY `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `updatedAt` DATETIME(6) NOT NULL;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_username_key` TO `uq_user_username`;
