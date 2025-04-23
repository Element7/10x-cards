/// <reference types="astro/client" />

import type { SupabaseClientType, User } from "./db/supabase.client";

interface Locals {
  supabase: SupabaseClientType;
  isAuthenticated: boolean;
  user: User | null;
}

declare namespace App {
  interface Locals {
    supabase: SupabaseClientType;
    isAuthenticated: boolean;
    user: User | null;
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly OPENROUTER_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
