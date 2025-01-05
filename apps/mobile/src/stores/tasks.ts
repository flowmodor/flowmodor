import { createStore } from '@flowmodor/stores/tasks';
import 'react-native-get-random-values';
import { supabase } from '@/src/utils/supabase';

export const store = createStore(supabase, console.error);