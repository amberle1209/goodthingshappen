import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  _client = createClient(url, key);
  return _client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
