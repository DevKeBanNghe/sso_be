-- CreateEnum
CREATE TYPE "TypeLogin" AS ENUM ('ACCOUNT', 'FACEBOOK', 'GOOGLE', 'GITHUB');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "user_first_name" TEXT,
    "user_last_name" TEXT,
    "user_name" TEXT NOT NULL,
    "user_password" TEXT,
    "user_email" TEXT,
    "user_date_of_birth" TEXT,
    "user_phone_number" TEXT,
    "user_image_url" TEXT,
    "user_type_login" "TypeLogin" NOT NULL DEFAULT 'ACCOUNT',
    "role_id" INTEGER,
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
    "group_role_id" INTEGER,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Webpage" (
    "webpage_id" SERIAL NOT NULL,
    "webpage_url" TEXT NOT NULL,
    "webpage_description" TEXT,

    CONSTRAINT "Webpage_pkey" PRIMARY KEY ("webpage_id")
);

-- CreateTable
CREATE TABLE "GroupRole" (
    "group_role_id" SERIAL NOT NULL,
    "group_role_name" TEXT NOT NULL,
    "group_role_description" TEXT,
    "group_role_parent_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "webpage_id" INTEGER,

    CONSTRAINT "GroupRole_pkey" PRIMARY KEY ("group_role_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" TEXT NOT NULL,
    "permission_description" TEXT,
    "permission_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "group_permission_id" INTEGER,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "GroupPermission" (
    "group_permission_id" SERIAL NOT NULL,
    "group_permission_name" TEXT NOT NULL,
    "group_permission_description" TEXT,
    "group_permission_parent_id" INTEGER,
    "group_permission_route_resources" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "group_role_id" INTEGER,

    CONSTRAINT "GroupPermission_pkey" PRIMARY KEY ("group_permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");
