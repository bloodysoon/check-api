export interface VideoModel {
  name: string;
  imageUrl: string;
  isOnline: boolean;
  id: number;
}

import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';
const supabaseUrl = 'https://lrsgsgkissnmromalfsu.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyc2dzZ2tpc3NubXJvbWFsZnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDExMzEsImV4cCI6MjA2MDExNzEzMX0.OlXZpo0mgZDnKK9iiEyrzF1avMlPdwa3YSuf3H0-YK4';


export async function getModels(): Promise<VideoModel[] | undefined> {
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('model')
    .select()
    .order('name', { ascending: true });

  if (error) {
    console.error('Error retrieving record:', error);
    return undefined;
  } else {
    return data;
  }
}

export async function getOnlineModels(): Promise<VideoModel[] | undefined> {
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from('model')
    .select()
    .eq('isOnline', true)
    .order('startedAt', { ascending: true });

  if (error) {
    console.error('Error retrieving record:', error);
    return undefined;
  } else {
    return data;
  }
}

export async function getAllModels(): Promise<VideoModel[] | undefined> {
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  console.log("get models");
  const { data, error } = await supabase
    .from('model')
    .select()
    .order('name', { ascending: true });

  if (error) {
    console.error('Error retrieving record:', error);
    return undefined;
  } else {
    return data;
  }
}

export async function addModel(name: string) {
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const { error } = await supabase.from('model').insert({ name });
  console.log(error);
}

// Delete a model row by its unique name
export async function deleteModelByName(name: string) {
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const { error } = await supabase.from('model').delete().eq('name', name);
  if (error) {
    console.error('Error deleting model by name:', name, error);
  }
}



export async function updateDbOnlineStatus(id: number, imageUrl : string, startedAt?: Date) {
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const { error, data } = await supabase
    .from('model')
    .update({ isOnline: true, imageUrl: imageUrl, startedAt: startedAt })
    .eq('id', id);

  if (error) {
    console.error(error);
  }
  if (data) {
    console.log(data);
  }
}

  export async function updateDbOnlineStatusToFalse(id: number) {
    const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
    await supabase.from('model').update({ isOnline: false }).eq('id', id);
  }
