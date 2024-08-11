create type "public"."feature_status" as enum ('completed', 'in_progress', 'approved');

drop policy "Enable read access for authenticated users" on "public"."features";

alter table "public"."features" add column "status" feature_status not null default 'approved'::feature_status;

create policy "Enable read access for authenticated and anon"
on "public"."features"
as permissive
for select
to authenticated, anon
using (true);



