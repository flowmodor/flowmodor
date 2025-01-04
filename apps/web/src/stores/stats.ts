import { createStore } from '@flowmodor/stores/stats';
import supabase from '@/utils/supabase/client';

export const store = createStore(supabase);
