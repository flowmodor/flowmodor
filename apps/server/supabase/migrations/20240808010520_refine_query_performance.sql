drop policy "Enable select for authenticated users based on user_id" on "public"."integrations";

drop policy "Enable update for authenticated users based on user_id" on "public"."integrations";

drop policy "Enable select for authenticated users based on user_id" on "public"."logs";

drop policy "Enable select for authenticated based on user_id" on "public"."profiles";

drop policy "Enable update for authenticated based on user_id" on "public"."profiles";

drop policy "Enable select for authenticated  users based on user_id" on "public"."settings";

drop policy "Enable update for authenticated users based on user_id" on "public"."settings";

drop policy "Enable delete for authenticated users based on user_id" on "public"."tasks";

drop policy "Enable select for authenticated users based on user_id" on "public"."tasks";

drop policy "Enable update for authenticated users based on user_id" on "public"."tasks";

create policy "Enable select for authenticated users based on user_id"
on "public"."integrations"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for authenticated users based on user_id"
on "public"."integrations"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable select for authenticated users based on user_id"
on "public"."logs"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable select for authenticated based on user_id"
on "public"."profiles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for authenticated based on user_id"
on "public"."profiles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable select for authenticated  users based on user_id"
on "public"."settings"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for authenticated users based on user_id"
on "public"."settings"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check (true);


create policy "Enable delete for authenticated users based on user_id"
on "public"."tasks"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable select for authenticated users based on user_id"
on "public"."tasks"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable update for authenticated users based on user_id"
on "public"."tasks"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


