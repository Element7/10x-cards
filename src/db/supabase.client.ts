import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: SUPABASE_KEY");
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// This is only for development purposes and should be removed in production
export const DEFAULT_USER_ID = "4bc73db4-8af2-4851-899e-fb9538cf200f";
