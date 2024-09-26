set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.settings (user_id, break_ratio)
  values (new.id, 5);

  insert into public.integrations (user_id, provider, access_token)
  values (new.id, NULL, NULL);

  insert into public.profiles (user_id, is_new)
  values (new.id, true);

  return new;
end;
$function$
;


