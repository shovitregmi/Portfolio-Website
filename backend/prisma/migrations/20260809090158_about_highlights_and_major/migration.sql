/*
  Warnings:

  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `major` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "major" SET NOT NULL,
ALTER COLUMN "major" SET DEFAULT 'BSc. CSIT';

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "showInAbout" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Certificate";
