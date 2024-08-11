alter table "public"."feedback" alter column "user_id" set default auth.uid();

alter table "public"."logs" alter column "user_id" set default auth.uid();


