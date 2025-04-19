import type { SupabaseClient } from "@supabase/supabase-js";
import type { FlashcardSuggestionDTO, GenerationCreateResponseDTO } from "../../types";
import crypto from "crypto";

export class GenerationService {
  constructor(private readonly supabase: SupabaseClient) {}

  async createGeneration(userId: string, sourceText: string): Promise<GenerationCreateResponseDTO> {
    try {
      // Calculate MD5 hash of source text
      const sourceTextHash = crypto.createHash("md5").update(sourceText).digest("hex");

      // Create a new generation record
      const { data: generation, error: insertError } = await this.supabase
        .from("generations")
        .insert({
          user_id: userId,
          model: "gpt-4", // TODO: Make configurable
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

      // TODO: Replace with actual AI service call
      const mockSuggestions: FlashcardSuggestionDTO[] = [
        {
          id: 1,
          front: "Mock Front 1",
          back: "Mock Back 1",
          source: "ai_full",
        },
        {
          id: 2,
          front: "Mock Front 2",
          back: "Mock Back 2",
          source: "ai_full",
        },
      ];

      // Update generation with actual count
      const { error: updateError } = await this.supabase
        .from("generations")
        .update({
          generated_count: mockSuggestions.length,
        })
        .eq("id", generation.id);

      if (updateError) {
        await this.logGenerationError(generation.id, "UPDATE_ERROR", updateError.message);
        throw new Error(`Failed to update generation count: ${updateError.message}`);
      }

      return {
        generation_id: generation.id,
        flashcard_suggestions: mockSuggestions,
        generated_count: mockSuggestions.length,
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
