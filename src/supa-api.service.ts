export interface VideoModel {
  name: string;
  imageUrl: string;
  isOnline: boolean;
  id: number;
  status?: string;
}

import { createBrowserClient } from '@supabase/ssr';

function createSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY is not set');
  }

  return createBrowserClient(url, key);
}

export async function getModels(): Promise<VideoModel[]> {
  const supabase = createSupabaseClient();

  let allData: any[] = [];
  let from = 0;
  const batchSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('ChatModels')
      .select('*')
      .range(from, from + batchSize - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error retrieving ChatModels:', error);
      return [];
    }

    if (data && data.length > 0) {
      allData = allData.concat(data);
      from += batchSize;
      hasMore = data.length === batchSize;
    } else {
      hasMore = false;
    }
  }

  return allData as VideoModel[];
}

export async function addModel(name: string, status?: string) {
  const supabase = createSupabaseClient();
  const payload: any = { name };
  if (status) payload.status = status;
  const { error } = await supabase.from('ChatModels').insert(payload);
  if (error) console.error('Error adding model:', error);
}

export async function updateDbOnlineStatus(
  id: number,
  imageUrl: string,
  startedAt?: Date,
) {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from('ChatModels')
    .update({ isOnline: true, imageUrl, startedAt })
    .eq('id', id);
  if (error) console.error('Error updating online status:', error);
}

export async function updateDbOnlineStatusToFalse(id: number) {
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from('ChatModels')
    .update({ isOnline: false })
    .eq('id', id);
  if (error) console.error('Error updating online status to false:', error);
}
