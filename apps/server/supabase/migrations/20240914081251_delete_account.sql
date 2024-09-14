set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_account()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin	
  delete from auth.users where id = auth.uid();
end;$function$
;
