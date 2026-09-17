export interface VideoModel {
  name: string;
  imageUrl: string;
  isOnline: boolean;
  id: number;
  status?: string;
  attemp?: number;
}

import { createClient } from '@supabase/supabase-js';

function createSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY is not set');
  }

  return createClient(url, key);
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
  console.log('Inserting into ChatModels:', payload);
  const { data, error } = await supabase.from('ChatModels').insert(payload).select();
  console.log('Supabase insert result:', { data, error });
  if (error) throw new Error(`Error adding model: ${error.message}`);
  return data;
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

export async function incrementAttemp(name: string) {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from('ChatModels')
    .select('attemp')
    .eq('name', name)
    .maybeSingle();

  if (error) throw new Error(`Error reading attemp: ${error.message}`);
  if (!data) throw new Error(`Model not found: ${name}`);

  const current = (data as any).attemp ?? 0;
  const next = current + 1;

  const { data: updated, error: updateError } = await supabase
    .from('ChatModels')
    .update({ attemp: next })
    .eq('name', name)
    .select()
    .single();

  if (updateError) throw new Error(`Error updating attemp: ${updateError.message}`);
  return updated;
}
