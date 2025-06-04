/*
  Warnings:

  - You are about to alter the column `status` on the `task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - Added the required column `updatedAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task` ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `priority` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending';
