alter table "public"."logs" rename column "task" to "task_id";
alter table "public"."logs" drop constraint "logs_task_fkey";
alter table "public"."logs" add constraint "logs_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) not valid;
alter table "public"."logs" validate constraint "logs_task_id_fkey";

alter table "public"."logs" add column "task_name" text;

create policy "Enable select for authenticated users based on user_id"
on "public"."logs"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));



