import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

const init = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) return null;
  if (!supabase) supabase = createClient(url, key);
  return supabase;
};

export const loadDataFromSupabase = async () => {
  const sb = init();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from('app_state').select('payload').eq('id', 'main').single();
    if (error) {
      console.warn('Supabase select error', error.message || error);
      return null;
    }
    return data?.payload || null;
  } catch (err) {
    console.error('Supabase load error', err);
    return null;
  }
};

export const saveDataToSupabase = async (payload: any) => {
  const sb = init();
  if (!sb) throw new Error('Supabase not configured');
  try {
    const row = { id: 'main', payload };
    const { error } = await sb.from('app_state').upsert(row, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase save error', err);
    throw err;
  }
};
