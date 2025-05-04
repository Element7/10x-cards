import { defineMiddleware } from "astro:middleware";
import { supabaseClient } from "../db/supabase.client";

const PROTECTED_ROUTES = ["/flashcards/generate"];

export const onRequest = defineMiddleware(async (context, next) => {
  // Use the existing Supabase client instance
  context.locals.supabase = supabaseClient;

  // Check session
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  context.locals.isAuthenticated = !!session;
  context.locals.user = session?.user ?? null;

  // Protect routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => context.url.pathname.startsWith(route));

  if (isProtectedRoute && !context.locals.isAuthenticated) {
    return context.redirect("/login");
  }

  const response = await next();
  return response;
});
