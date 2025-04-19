import type { FlashcardSource, FlashcardSuggestionDTO, GenerationCreateResponseDTO } from "@/types";

/**
 * View model for the generation mode toggle
 */
export type GenerationMode = "ai" | "manual";

/**
 * View model for the flashcard generation view state
 */
export interface GenerationViewState {
  mode: GenerationMode;
  isGenerating: boolean;
  generationError: string | null;
  flashcardSuggestions: FlashcardSuggestionViewModel[];
  generationId: string | null;
  editingFlashcardId: number | null;
}

/**
 * View model for a flashcard suggestion
 */
export interface FlashcardSuggestionViewModel {
  id: number;
  front: string;
  back: string;
  source: Extract<FlashcardSource, "ai_full">;
  isProcessing: boolean;
  error: string | null;
}

/**
 * View model for manual flashcard creation
 */
export interface ManualFlashcardViewModel {
  front: string;
  back: string;
  frontError: string | null;
  backError: string | null;
  isProcessing: boolean;
  error: string | null;
}

/**
 * Mapping functions between API DTOs and view models
 */
export const mapFlashcardSuggestionDtoToViewModel = (dto: FlashcardSuggestionDTO): FlashcardSuggestionViewModel => ({
  id: dto.id,
  front: dto.front,
  back: dto.back,
  source: dto.source,
  isProcessing: false,
  error: null,
});

export const mapGenerationResponseToState = (response: GenerationCreateResponseDTO): Partial<GenerationViewState> => ({
  flashcardSuggestions: response.flashcard_suggestions.map(mapFlashcardSuggestionDtoToViewModel),
  generationId: response.generation_id,
  isGenerating: false,
  generationError: null,
});
