/*
  Warnings:

  - You are about to drop the column `group_permission_id` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `group_role_id` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `GroupPermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "group_permission_id",
ADD COLUMN     "permission_parent_id" INTEGER;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "group_role_id",
ADD COLUMN     "role_parent_id" INTEGER,
ADD COLUMN     "webpage_id" INTEGER;

-- DropTable
DROP TABLE "GroupPermission";

-- DropTable
DROP TABLE "GroupRole";
