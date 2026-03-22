-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "resetOtpHash" TEXT;
