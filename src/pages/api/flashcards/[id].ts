import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { id } = params;
  const { supabase, user } = locals;

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { error } = await supabase
    .from("flashcards")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error deleting flashcard:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete flashcard" }), 
      { status: 500 }
    );
  }

  return new Response(null, { status: 204 });
}; 