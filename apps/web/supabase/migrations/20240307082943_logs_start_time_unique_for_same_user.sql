alter table "public"."logs" drop constraint "logs_start_time_key";

drop index if exists "public"."logs_start_time_key";

CREATE UNIQUE INDEX logs_user_id_start_time_unique ON public.logs USING btree (user_id, start_time);

alter table "public"."logs" add constraint "logs_user_id_start_time_unique" UNIQUE using index "logs_user_id_start_time_unique";


