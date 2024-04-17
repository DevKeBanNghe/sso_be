-- CreateEnum
CREATE TYPE "TypeLogin" AS ENUM ('ACCOUNT', 'FACEBOOK', 'GOOGLE');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "user_first_name" TEXT,
    "user_last_name" TEXT,
    "user_name" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_date_of_birth" TEXT,
    "user_phone_number" TEXT,
    "user_type_login" "TypeLogin" NOT NULL DEFAULT 'ACCOUNT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Device" (
    "device_id" SERIAL NOT NULL,
    "device_ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("device_id")
);

-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,
    "role_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Group" (
    "group_id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "group_description" TEXT,
    "group_parent_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "GroupRole" (
    "group_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "GroupRole_pkey" PRIMARY KEY ("group_id","role_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" TEXT NOT NULL,
    "permission_description" TEXT NOT NULL,
    "permission_route" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "GroupPermission" (
    "group_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "GroupPermission_pkey" PRIMARY KEY ("group_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");
