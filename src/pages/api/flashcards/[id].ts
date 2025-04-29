import type { APIRoute } from "astro";
import { z } from "zod";

// Validation schema for PUT
const UpdateFlashcardSchema = z.object({
  front: z.string().max(200),
  back: z.string().max(500),
  source: z.enum(["ai_edited", "manual"]),
});

export const DELETE: APIRoute = async ({ params, locals }) => {
  const { id } = params;
  const { supabase, user } = locals;

  if (!user || !id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { error } = await supabase.from("flashcards").delete().eq("id", id).eq("user_id", user.id).single();

  if (error) {
    console.error("Error deleting flashcard:", error);
    return new Response(JSON.stringify({ error: "Failed to delete flashcard" }), { status: 500 });
  }

  return new Response(null, { status: 204 });
};

export const PUT: APIRoute = async ({ request, params, locals }) => {
  try {
    const { id } = params;
    const { user, supabase } = locals;

    if (!user || !id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await request.json();
    const flashcard = UpdateFlashcardSchema.parse(body);

    const { data, error } = await supabase
      .from("flashcards")
      .update(flashcard)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating flashcard:", error);
      return new Response(JSON.stringify({ error: "Failed to update flashcard" }), { status: 500 });
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "Flashcard not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: error.errors,
        }),
        { status: 400 }
      );
    }

    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};