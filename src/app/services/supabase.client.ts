import { createClient } from '@supabase/supabase-js';
import { environments } from '../../environments/environment';

export const supabase = createClient(environments.supebaseUrl, environments.supabaseAnonkey);
