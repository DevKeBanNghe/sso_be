/*
  Warnings:

  - You are about to drop the column `role_is_all_permissions` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "role_is_all_permissions";
