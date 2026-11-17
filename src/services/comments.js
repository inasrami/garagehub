import { getClient } from '../lib/supabase';

export async function getComments(carId, signal) {
  const { data, error } = await getClient().from('comments')
    .select('id, car_id, author_id, body, created_at, profiles(display_name)')
    .eq('car_id', carId).order('created_at', { ascending: true }).abortSignal(signal);
  if (error) throw error;
  return data;
}

export async function createComment(carId, body) {
  const { error } = await getClient().from('comments').insert({ car_id: carId, body: body.trim() });
  if (error) throw error;
}

export async function deleteComment(id) {
  const { data, error } = await getClient().from('comments').delete().eq('id', id).select('id').maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('This comment no longer exists or you cannot delete it.');
}
