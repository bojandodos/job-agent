-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobSeeker" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSeeker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JobSeeker_userId_key" ON "JobSeeker"("userId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobSeeker" ADD CONSTRAINT "JobSeeker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing data from User columns into the new tables
INSERT INTO "Company" ("id", "name", "userId")
SELECT "id" || '_company', "companyName", "id" FROM "User"
WHERE "userType" = 'Company' AND "companyName" IS NOT NULL;

INSERT INTO "JobSeeker" ("id", "name", "userId")
SELECT "id" || '_jobseeker', "jobSeekerName", "id" FROM "User"
WHERE "userType" = 'JobSeeker' AND "jobSeekerName" IS NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "companyName",
DROP COLUMN "jobSeekerName";
