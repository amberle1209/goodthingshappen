import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface EntryRow {
  id: string;
  entries: string[];
  mood: string;
  tone: string;
  scene_prompt: string | null;
  image_url: string | null;
  card_url: string | null;
  prompt_version: string;
  prediction_id: string | null;
  status: "pending" | "generating" | "processing" | "complete" | "failed";
  error_message: string | null;
  created_at: string;
  updated_at: string;
}
