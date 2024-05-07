/*
  Warnings:

  - You are about to drop the column `group_permission_route_resources` on the `GroupPermission` table. All the data in the column will be lost.
  - Added the required column `permission_router` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupPermission" DROP COLUMN "group_permission_route_resources";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "permission_router" TEXT NOT NULL;
