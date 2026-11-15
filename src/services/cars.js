import { getClient } from '../lib/supabase';
import { isUuid } from '../utils/validation';

const carFields = 'id, owner_id, make, model, year, image_url, description, created_at, profiles(display_name)';

export async function getCars(signal, ownerId) {
  let query = getClient().from('cars').select(carFields).order('created_at', { ascending: false });
  if (ownerId) query = query.eq('owner_id', ownerId);
  const { data, error } = await query.abortSignal(signal);
  if (error) throw error;
  return data;
}

export async function getCar(id, signal) {
  if (!isUuid(id)) return null;
  const { data, error } = await getClient().from('cars').select(carFields)
    .eq('id', id).abortSignal(signal).maybeSingle();
  if (error) throw error;
  return data;
}
