create type "public"."plan" as enum ('Starter', 'Pro');

alter type "public"."status" rename to "status__old_version_to_be_dropped";

create type "public"."status" as enum ('active', 'canceled', 'past_due', 'paused', 'trialing');

drop type "public"."status__old_version_to_be_dropped";

alter table "public"."plans" add column "plan" plan not null default 'Starter'::plan;

alter table "public"."plans" add column "status" status;


