alter table "public"."integrations" drop constraint "integrations_user_id_fkey";

alter table "public"."logs" drop constraint "logs_user_id_fkey";

alter table "public"."profiles" drop constraint "profiles_user_id_fkey";

alter table "public"."settings" drop constraint "settings_user_id_fkey";

alter table "public"."tasks" drop constraint "tasks_user_id_fkey";

alter table "public"."logs" alter column "user_id" drop default;

alter table "public"."settings" alter column "user_id" drop default;

alter table "public"."tasks" alter column "user_id" drop default;

alter table "public"."integrations" add constraint "integrations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."integrations" validate constraint "integrations_user_id_fkey";

alter table "public"."logs" add constraint "logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."logs" validate constraint "logs_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."settings" add constraint "settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."settings" validate constraint "settings_user_id_fkey";

alter table "public"."tasks" add constraint "tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."tasks" validate constraint "tasks_user_id_fkey";


