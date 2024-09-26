alter table "public"."logs" alter column "user_id" set default auth.uid();

alter table "public"."logs" enable row level security;

alter table "public"."tasks" alter column "user_id" set default auth.uid();

alter table "public"."tasks" enable row level security;

create policy "Enable insert for authenticated users only"
on "public"."logs"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."tasks"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users based on user_id"
on "public"."tasks"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable update for authenticated users based on user_id"
on "public"."tasks"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));



