create policy "Enable update for authenticated based on user_id"
on "public"."plans"
as permissive
for update
to authenticated
using ((auth.uid() = user_id));



