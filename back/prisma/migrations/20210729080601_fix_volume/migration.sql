/*
  Warnings:

  - A unique constraint covering the columns `[serial]` on the table `volume` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serial` to the `volume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `volume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `volume` ADD COLUMN `serial` VARCHAR(191) NOT NULL,
    ADD COLUMN `source` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `volume.serial_unique` ON `volume`(`serial`);
