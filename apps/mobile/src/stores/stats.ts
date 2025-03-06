import { createStore } from '@flowmo/stores/stats';
import { supabase } from '../utils/supabase';

export const store = createStore(supabase);
