import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ locals }) => {
  try {
    const { error } = await locals.supabase.auth.signOut();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error signing out:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
