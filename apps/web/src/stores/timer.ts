import { createStore } from '@flowmodor/stores/timer';
import supabase from '@/utils/supabase/client';
import { store as statsStore } from './stats';

export const store = createStore(supabase, statsStore);
