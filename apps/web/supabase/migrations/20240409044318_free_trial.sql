create extension if not exists "pg_cron" with schema "extensions";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_expired_integrations()
 RETURNS void
 LANGUAGE plpgsql
AS $function$begin
    UPDATE public.integrations
    SET access_token = null, provider = null
    WHERE user_id IN (
        SELECT user_id
        FROM public.plans
        WHERE end_time < CURRENT_TIMESTAMP
    );
end$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.settings (user_id, break_ratio)
  values (new.id, 5);

  insert into public.plans (user_id, status, plan, end_time)
  values (new.id, 'trialing', 'Pro', CURRENT_TIMESTAMP + INTERVAL '7 days');

  insert into public.integrations (user_id, provider, access_token)
  values (new.id, NULL, NULL);

  insert into public.profiles (user_id, is_new)
  values (new.id, true);

  return new;
end;
$function$
;

select cron.schedule('call-update_expired_integrations', '0 * * * *', 'select update_expired_integrations()');
