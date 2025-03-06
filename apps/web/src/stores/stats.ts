import { createStore } from '@flowmo/stores/stats';
import supabase from '@/utils/supabase/client';

export const store = createStore(supabase);
