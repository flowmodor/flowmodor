alter table "public"."logs" drop constraint "logs_task_id_fkey";

alter table "public"."logs" add constraint "logs_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE not valid;

alter table "public"."logs" validate constraint "logs_task_id_fkey";

create policy "Enable delete for authenticated users based on user_id"
on "public"."tasks"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));



