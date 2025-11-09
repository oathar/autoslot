-- AlterEnum
ALTER TYPE "public"."Role" ADD VALUE 'admin';

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extracted" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);
