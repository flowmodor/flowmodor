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
        WHERE end_time < CURRENT_TIMESTAMP OR status = 'canceled'
    );

    UPDATE public.settings
    SET break_ratio = 5
    WHERE user_id IN (
        SELECT user_id
        FROM public.plans
        WHERE end_time < CURRENT_TIMESTAMP OR status = 'canceled'
    );
end$function$
;


