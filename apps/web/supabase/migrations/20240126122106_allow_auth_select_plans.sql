drop policy "Enable select for anon" on "public"."plans";

create policy "Enable select for anon"
on "public"."plans"
as permissive
for select
to anon, authenticated
using (true);



