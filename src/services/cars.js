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

export async function createCar(values) {
  const { data, error } = await getClient().from('cars').insert(values).select('id').single();
  if (error) throw error;
  return data;
}

export async function updateCar(id, values) {
  const { data, error } = await getClient().from('cars').update(values).eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('This car no longer exists or you do not have permission to edit it.');
  return data;
}

export async function deleteCar(id) {
  const { data, error } = await getClient().from('cars').delete().eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('This car no longer exists or you do not have permission to delete it.');
}
