alter table "public"."logs" alter column "mode" drop not null;

DELETE FROM logs
WHERE mode = 'break';
