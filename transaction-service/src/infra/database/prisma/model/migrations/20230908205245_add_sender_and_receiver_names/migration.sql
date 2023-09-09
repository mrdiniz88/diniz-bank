/*
  Warnings:

  - Added the required column `receiver_name` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_name` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "receiver_name" TEXT NOT NULL,
ADD COLUMN     "sender_name" TEXT NOT NULL;
