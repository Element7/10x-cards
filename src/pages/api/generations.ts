import { z } from "zod";
import type { APIRoute } from "astro";
// import type { GenerationCreateResponseDTO } from "../../types";
import { GenerationService } from "../../lib/services/generation.service";
import { OpenRouterService } from "../../lib/services/openrouter.service";

// Validation schema for the request body
const generationCreateSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Source text must be at least 1000 characters")
    .max(10000, "Source text cannot exceed 10000 characters"),
});

// Initialize OpenRouter service with configuration
const openRouterService = new OpenRouterService({
  apiKey: import.meta.env.OPENROUTER_API_KEY,
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  defaultModel: "gpt-4",
  modelParams: {
    temperature: 0.7,
    max_tokens: 2000,
  },
});

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Check if user is authenticated
    if (!locals.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    // Initialize generation service with both required dependencies
    const generationService = new GenerationService(locals.supabase, openRouterService);
    const result = await generationService.createGeneration(locals.user.id, source_text);

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
