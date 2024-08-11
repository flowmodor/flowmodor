CREATE UNIQUE INDEX logs_start_time_key ON public.logs USING btree (start_time);

alter table "public"."logs" add constraint "logs_start_time_key" UNIQUE using index "logs_start_time_key";


