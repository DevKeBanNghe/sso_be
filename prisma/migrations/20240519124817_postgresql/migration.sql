/*
  Warnings:

  - Made the column `permission_parent_id` on table `Permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role_parent_id` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "permission_parent_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "role_parent_id" SET NOT NULL;
