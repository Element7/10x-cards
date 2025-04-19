import type { APIRoute } from "astro";
import { z } from "zod";
// import type { FlashcardListResponseDTO } from "../../types";
// import type { FlashcardCreateDTO } from "../../types";
import { FlashcardsService } from "../../lib/services/flashcards.service";
import { DEFAULT_USER_ID } from "../../db/supabase.client";

// Query parameters validation schema for GET
const QueryParamsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(50).default(10),
  sortBy: z.enum(["created_at", "updated_at"]).optional(),
  filter: z.enum(["manual", "ai_full", "ai_edited"] as const).optional(),
});

// Validation schema for POST
const CreateFlashcardSchema = z.object({
  front: z.string().max(200),
  back: z.string().max(500),
  source: z.enum(["manual", "ai_full", "ai_edited"]),
  generation_id: z.string().uuid().optional(),
});

const CreateFlashcardsSchema = z.object({
  flashcards: z.array(CreateFlashcardSchema),
});

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const rawParams = Object.fromEntries(url.searchParams.entries());
    const params = QueryParamsSchema.parse(rawParams);

    const flashcardsService = new FlashcardsService(locals.supabase);
    const response = await flashcardsService.getFlashcards({
      ...params,
      userId: DEFAULT_USER_ID,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: error.errors,
        }),
        { status: 400 }
      );
    }

    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { flashcards } = CreateFlashcardsSchema.parse(body);

    const flashcardsService = new FlashcardsService(locals.supabase);
    const response = await flashcardsService.createFlashcards({
      flashcards,
      userId: DEFAULT_USER_ID,
    });

    return new Response(JSON.stringify(response), {
      status: 201,
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
