import type { Database } from "./db/database.types";

// Database type aliases for easier reuse
type DBFlashcard = Database["public"]["Tables"]["flashcards"]["Row"];
type DBGeneration = Database["public"]["Tables"]["generations"]["Row"];
type DBGenerationErrorLog = Database["public"]["Tables"]["generation_error_logs"]["Row"];

/*
 * FlashcardSource represents the allowed values for a flashcard's source.
 */
export type FlashcardSource = "manual" | "ai_full" | "ai_edited";

/*
 * FlashcardUpdateSource represents the allowed values when updating a flashcard (excluding 'ai_full').
 */
export type FlashcardUpdateSource = Exclude<FlashcardSource, "ai_full">;

/* Pagination DTO for paginated API responses */
export interface PaginationDTO {
  page: number;
  limit: number;
  total: number;
}

/**
 * FlashcardDTO maps the DB flashcards table to the API response format.
 */
export interface FlashcardDTO {
  id: DBFlashcard["id"];
  front: DBFlashcard["front"];
  back: DBFlashcard["back"];
  source: FlashcardSource;
  generation_id: DBFlashcard["generation_id"];
  created_at: DBFlashcard["created_at"];
  updated_at: DBFlashcard["updated_at"];
}

/**
 * Command model for creating a flashcard.
 * Based on DB flashcards insert model with selected fields (user_id, timestamps, and id are omitted).
 */
export interface FlashcardCreateDTO {
  front: DBFlashcard["front"]; // max 200 characters
  back: DBFlashcard["back"]; // max 500 characters
  source: FlashcardSource;
  generation_id?: DBFlashcard["generation_id"];
}

/**
 * Command for creating multiple flashcards.
 */
export interface FlashcardsCreateCommand {
  flashcards: FlashcardCreateDTO[];
}

/**
 * Response DTO after creating flashcards.
 * Returns the created flashcards along with a count.
 */
export interface FlashcardCreateResponseDTO {
  flashcards: FlashcardDTO[];
  total_created: number;
}

/**
 * Command model for updating an existing flashcard.
 * Allows editing of front and back text and changing the source to either 'ai_edited' or 'manual'.
 */
export interface FlashcardUpdateDTO {
  front: DBFlashcard["front"];
  back: DBFlashcard["back"];
  source: FlashcardUpdateSource;
}

/**
 * Paginated response for flashcards.
 */
export interface FlashcardListResponseDTO {
  flashcards: FlashcardDTO[];
  pagination: PaginationDTO;
}

/**
 * FlashcardSuggestionDTO represents an AI-generated flashcard suggestion.
 * These suggestions are not stored in the database but returned as part of the generation response.
 */
export interface FlashcardSuggestionDTO {
  id: number;
  front: string;
  back: string;
  source: Extract<FlashcardSource, "ai_full">;
}

/**
 * Command model for accepting an AI-generated flashcard suggestion.
 * This type is used when a user accepts an AI-generated suggestion to create a flashcard.
 * It is based on FlashcardCreateDTO with the 'source' enforced to 'ai_full'.
 */
export type AcceptFlashcardSuggestionDTO = Omit<FlashcardCreateDTO, "source"> & {
  source: Extract<FlashcardSource, "ai_full">;
};

/**
 * Command model to initiate a generation process.
 * Accepts source_text as per API specification (1000-10000 characters).
 */
export interface GenerationCreateDTO {
  source_text: string;
}

/**
 * Response DTO after initiating a generation process.
 * Contains the generation id, flashcard suggestions, and the count of generated suggestions.
 */
export interface GenerationCreateResponseDTO {
  generation_id: string;
  flashcard_suggestions: FlashcardSuggestionDTO[];
  generated_count: number;
}

/**
 * GenerationDTO maps the DB generations table to the API DTO.
 */
export interface GenerationDTO {
  generation_id: DBGeneration["id"];
  model: DBGeneration["model"];
  generated_count: DBGeneration["generated_count"];
  accepted_unedited_count: DBGeneration["accepted_unedited_count"];
  accepted_edited_count: DBGeneration["accepted_edited_count"];
  created_at: DBGeneration["created_at"];
  updated_at: DBGeneration["updated_at"];
}

/**
 * Paginated response DTO for a list of generations.
 */
export interface GenerationListResponseDTO {
  generations: GenerationDTO[];
  total: number;
  page: number;
  per_page: number;
}

/**
 * GenerationErrorLogDTO maps the DB generation_error_logs table to the API response format.
 */
export interface GenerationErrorLogDTO {
  id: DBGenerationErrorLog["id"];
  model: DBGenerationErrorLog["model"];
  error_code: DBGenerationErrorLog["error_code"];
  error_message: DBGenerationErrorLog["error_message"];
  created_at: DBGenerationErrorLog["created_at"];
}

/**
 * Response DTO for a list of generation error logs.
 */
export interface GenerationErrorLogListResponseDTO {
  error_logs: GenerationErrorLogDTO[];
}
