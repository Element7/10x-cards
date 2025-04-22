import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";

export const onRequest = defineMiddleware(async (context, next) => {
  const supabaseUrl = import.meta.env.SUPABASE_URL;
  const supabaseKey = import.meta.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing required environment variables for Supabase");
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);
  
  context.locals.supabase = supabase;

  const response = await next();
  return response;
});
