ALTER TABLE "profiles" DROP CONSTRAINT "profiles_account_id_fkey";
--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "account_id";