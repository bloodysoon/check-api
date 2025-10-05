export interface VideoModel {
  id?: number;
  videoId: string[];
  name: string;
  brest: number;
  nipples: number;
  legs: number;
  ass: number;
  face: number;
  pussy: number;
  overall: number;
  voice: number;
  content: number;
  eyes: number;
  lips: number;
  waist: number;
  wife: number;
  haire: number;
  nails: number;
  skin: number;
  hands: number;
  rear: number;
  front: number;
  nose: number;
  ears: number;
  height: number;
  weight: number;
  instagram: null | string | undefined;
  tiktok: null | string;
  isOnline: boolean;
  onlineCount: number;
  averageRating: number;
}

import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';
const supabaseUrl = 'https://mhezydornlecnirzrcva.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZXp5ZG9ybmxlY25pcnpyY3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3Njc1NjgsImV4cCI6MjA1NDM0MzU2OH0.MdypDytkc-8IFTfECb1DZmBufWIrOYA3lnxOQ7WNl6A';

  export async function getData(): Promise<VideoModel[] | undefined> {
    const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("models")
      .select()
      .order("averageRating", { ascending: false });
  
    if (error) {
      console.error('Error retrieving record:', error);
      return undefined;
    } else {
      const validData = data.filter(
        (model) => model.averageRating != null && model.averageRating > 0
      ); 
      const selectedGirls = validData.slice(0, 256);
      return shuffle(selectedGirls);
    }
  }
  

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function add(updateData: VideoModel) {
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const { error } = await supabase.from('models').insert(updateData);
  console.log(error);
}

export async function update(updateData: VideoModel) {
  updateData.averageRating = calculateAverageRating(updateData);
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const { error } = await supabase
    .from('models')
    .update(updateData)
    .eq('id', updateData.id);
  console.log(error);
}

export async function updateDbOnlineStatus(id: number, onlineCount: number) {
  console.log("Update model")
  console.log(id)
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const { error, data } = await supabase
    .from('models')
    .update({ isOnline: true, onlineCount: onlineCount + 1 })
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
  await supabase.from('models').update({ isOnline: false }).eq('id', id);
}

export const calculateAverageRating = (video: VideoModel): number => {
  const ratingFields = [
    video.brest,
    video.nipples,
    video.legs,
    video.ass,
    video.face,
    video.pussy,
    video.overall,
    video.voice,
    video.content,
    video.eyes,
    video.lips,
    video.waist,
    video.wife,
    video.haire,
    video.nails,
    video.skin,
    video.hands,
    video.rear,
    video.front,
    video.nose,
    video.ears,
    video.height,
    video.weight,
  ];

  const total = ratingFields.reduce((sum, rating) => sum + rating, 0);
  return parseFloat((total / ratingFields.length).toFixed(1)); // Rounded to 1 decimal place
};


export async function updateModelPlaces(idModel: number, place: string) {
  const supabase = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  const { data: model, error } = await supabase
    .from("models")
    .select("*")
    .eq("id", idModel)
    .single();

  if (error || !model) {
    console.error("Error fetching model:", error);
    return;
  }
  
  // Folosim model[place] pentru a accesa valoarea actuală din câmpul specificat de 'place'
  const { error: updateError } = await supabase
    .from("models")
    .update({ [place]: model[place] + 1 })
    .eq("id", model.id);

  if (updateError) {
    console.error("Error updating model:", updateError);
  } else {
    console.log("Model updated successfully");
  }
}


