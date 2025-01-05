import { createStore } from '@flowmodor/stores/stats';
import { supabase } from '../utils/supabase';

export const store = createStore(supabase);
