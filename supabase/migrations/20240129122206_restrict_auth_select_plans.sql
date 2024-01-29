drop policy "Enable select for anon" on "public"."plans";

create policy "Enable select for authenticated users based on user_id"
on "public"."plans"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Enable select for anon"
on "public"."plans"
as permissive
for select
to anon
using (true);



