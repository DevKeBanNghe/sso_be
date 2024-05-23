-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "permission_parent_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "role_parent_id" DROP NOT NULL;
