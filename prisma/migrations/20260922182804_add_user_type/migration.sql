-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Company', 'JobSeeker');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "jobSeekerName" TEXT,
ADD COLUMN     "userType" "UserType";
