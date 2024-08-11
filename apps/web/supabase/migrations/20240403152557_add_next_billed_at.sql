alter table "public"."plans" add column "next_billed_at" timestamp with time zone;

alter table "public"."plans" alter column "end_time" set data type timestamp with time zone using "end_time"::timestamp with time zone;


