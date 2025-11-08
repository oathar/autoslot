-- CreateEnum
CREATE TYPE "public"."Program" AS ENUM ('B.Ed.', 'M.Ed.', 'FYUP', 'ITEP');

-- CreateEnum
CREATE TYPE "public"."Semester" AS ENUM ('1st', '2nd', '3rd', '4th', '5th', '6th');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('superadmin', 'teacher', 'HOD');

-- CreateTable
CREATE TABLE "public"."teachers" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "programs" "public"."Program" NOT NULL,
    "semester" "public"."Semester" NOT NULL,
    "role" "public"."Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teachers_username_key" ON "public"."teachers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "public"."teachers"("email");
