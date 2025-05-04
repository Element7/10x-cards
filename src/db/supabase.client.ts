import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

// This is only for development purposes and should be removed in production
export const DEFAULT_USER_ID = "4bc73db4-8af2-4851-899e-fb9538cf200f";

export type SupabaseClientType = typeof supabaseClient;

export interface User {
  id: string;
  email?: string;
  role?: string;
}
