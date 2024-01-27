create type "public"."status" as enum ('SUSPENDED', 'ACTIVE', 'APPROVAL_PENDING', 'CANCELLED', 'APPROVED', 'EXPIRED');

alter table "public"."plans" add column "end_time" timestamp without time zone;

alter table "public"."plans" add column "status" status;


