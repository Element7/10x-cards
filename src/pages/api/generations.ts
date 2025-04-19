import { z } from "zod";
import type { APIRoute } from "astro";
// import type { GenerationCreateResponseDTO } from "../../types";
import { GenerationService } from "../../lib/services/generation.service";
import { supabaseClient, DEFAULT_USER_ID } from "../../db/supabase.client";

// Validation schema for the request body
const generationCreateSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Source text must be at least 1000 characters")
    .max(10000, "Source text cannot exceed 10000 characters"),
});

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = generationCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { source_text } = validationResult.data;

    // Initialize generation service and create generation using DEFAULT_USER_ID
    const generationService = new GenerationService(supabaseClient);
    const result = await generationService.createGeneration(DEFAULT_USER_ID, source_text);

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing generation request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
