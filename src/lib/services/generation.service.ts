import type { SupabaseClient } from "@supabase/supabase-js";
import type { FlashcardSuggestionDTO, GenerationCreateResponseDTO } from "../../types";
import crypto from "crypto";
import { OpenRouterService } from "./openrouter.service";

export class GenerationService {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly openRouter: OpenRouterService
  ) {}

  async createGeneration(userId: string, sourceText: string): Promise<GenerationCreateResponseDTO> {
    try {
      // Calculate MD5 hash of source text
      const sourceTextHash = crypto.createHash("md5").update(sourceText).digest("hex");

      // Create a new generation record
      const { data: generation, error: insertError } = await this.supabase
        .from("generations")
        .insert({
          user_id: userId,
          model: "gpt-4",
          source_text_hash: sourceTextHash,
          source_text_length: sourceText.length,
          generated_count: 0,
          accepted_unedited_count: 0,
          accepted_edited_count: 0,
          generation_duration: 0,
        })
        .select("id")
        .single();

      if (insertError) {
        throw new Error(`Failed to create generation: ${insertError.message}`);
      }

      // Generate flashcards using OpenRouter
      const startTime = Date.now();
      const flashcards = await this.openRouter.generateFlashcards(sourceText);
      const generationDuration = Date.now() - startTime;

      // Map flashcards to DTO format with IDs
      const flashcardSuggestions: FlashcardSuggestionDTO[] = flashcards.map((card, index) => ({
        id: index + 1,
        front: card.front,
        back: card.back,
        source: card.source,
      }));

      // Update generation with actual count and duration
      const { error: updateError } = await this.supabase
        .from("generations")
        .update({
          generated_count: flashcardSuggestions.length,
          generation_duration: generationDuration,
        })
        .eq("id", generation.id);

      if (updateError) {
        await this.logGenerationError(generation.id, "UPDATE_ERROR", updateError.message);
        throw new Error(`Failed to update generation count: ${updateError.message}`);
      }

      return {
        generation_id: generation.id,
        flashcard_suggestions: flashcardSuggestions,
        generated_count: flashcardSuggestions.length,
      };
    } catch (error) {
      // Log any unexpected errors
      await this.logGenerationError(null, "UNEXPECTED_ERROR", error instanceof Error ? error.message : "Unknown error");
      throw error;
    }
  }

  private async logGenerationError(
    generationId: string | null,
    errorCode: string,
    errorMessage: string
  ): Promise<void> {
    try {
      await this.supabase.from("generation_error_logs").insert({
        generation_id: generationId,
        model: "gpt-4", // TODO: Make configurable
        error_code: errorCode,
        error_message: errorMessage,
      });
    } catch (error) {
      console.error("Failed to log generation error:", error);
    }
  }
}
