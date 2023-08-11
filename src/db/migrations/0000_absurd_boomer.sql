CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(256) NOT NULL,
	"password" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
