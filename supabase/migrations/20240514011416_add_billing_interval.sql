create type "public"."billing_interval" as enum ('month', 'year');

alter table "public"."plans" add column "billing_interval" billing_interval;


