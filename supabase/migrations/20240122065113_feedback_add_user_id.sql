alter table "public"."feedback" add column "user_id" uuid;

alter table "public"."feedback" add constraint "feedback_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."feedback" validate constraint "feedback_user_id_fkey";


