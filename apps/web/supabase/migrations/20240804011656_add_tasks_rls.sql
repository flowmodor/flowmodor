create policy "Enable delete for authenticated users based on user_id"
on "public"."tasks"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));



