CREATE TABLE IF NOT EXISTS "friendsTable" (
	"userId" uuid NOT NULL,
	"friendId" uuid NOT NULL,
	CONSTRAINT "friendsTable_userId_friendId_pk" PRIMARY KEY("userId","friendId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personalMessagesTable" (
	"messageId" serial NOT NULL,
	"from" uuid,
	"to" uuid,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomMessagesTable" (
	"messageId" serial NOT NULL,
	"from" uuid,
	"roomId" uuid,
	"message" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roomsTable" (
	"roomId" uuid DEFAULT gen_random_uuid(),
	"roomName" text NOT NULL,
	CONSTRAINT "roomsTable_roomId_unique" UNIQUE("roomId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userTable" (
	"userId" uuid DEFAULT gen_random_uuid(),
	"email" text NOT NULL,
	"password" text NOT NULL,
	"username" text NOT NULL,
	CONSTRAINT "userTable_userId_unique" UNIQUE("userId"),
	CONSTRAINT "userTable_email_unique" UNIQUE("email"),
	CONSTRAINT "userTable_password_unique" UNIQUE("password"),
	CONSTRAINT "userTable_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersToRoomsTable" (
	"userId" uuid NOT NULL,
	"roomId" uuid NOT NULL,
	CONSTRAINT "usersToRoomsTable_userId_roomId_pk" PRIMARY KEY("userId","roomId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friendsTable" ADD CONSTRAINT "friendsTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "friendsTable" ADD CONSTRAINT "friendsTable_friendId_userTable_userId_fk" FOREIGN KEY ("friendId") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToRoomsTable" ADD CONSTRAINT "usersToRoomsTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToRoomsTable" ADD CONSTRAINT "usersToRoomsTable_roomId_roomsTable_roomId_fk" FOREIGN KEY ("roomId") REFERENCES "public"."roomsTable"("roomId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
