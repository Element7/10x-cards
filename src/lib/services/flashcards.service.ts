import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  FlashcardDTO,
  FlashcardListResponseDTO,
  FlashcardSource,
  FlashcardCreateDTO,
  FlashcardCreateResponseDTO,
} from "../../types";

interface GetFlashcardsParams {
  page: number;
  limit: number;
  sortBy?: "created_at" | "updated_at";
  filter?: FlashcardSource;
  userId: string;
}

interface CreateFlashcardsParams {
  flashcards: FlashcardCreateDTO[];
  userId: string;
}

export class FlashcardsService {
  constructor(private readonly supabase: SupabaseClient) {}

  async getFlashcards(params: GetFlashcardsParams): Promise<FlashcardListResponseDTO> {
    const { page, limit, sortBy = "created_at", filter, userId } = params;
    const offset = (page - 1) * limit;

    // Start building the query
    let query = this.supabase
      .from("flashcards")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order(sortBy, { ascending: false });

    // Apply source filter if provided
    if (filter) {
      query = query.eq("source", filter);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch flashcards: ${error.message}`);
    }

    if (!data || count === null) {
      throw new Error("Failed to fetch flashcards: No data returned");
    }

    // Transform database rows to DTOs
    const flashcards: FlashcardDTO[] = data.map((row) => ({
      id: row.id,
      front: row.front,
      back: row.back,
      source: row.source as FlashcardSource,
      generation_id: row.generation_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return {
      flashcards,
      pagination: {
        page,
        limit,
        total: count,
      },
    };
  }

  async createFlashcards(params: CreateFlashcardsParams): Promise<FlashcardCreateResponseDTO> {
    const { flashcards, userId } = params;

    // Prepare flashcards with user_id
    const flashcardsToInsert = flashcards.map((flashcard) => ({
      ...flashcard,
      user_id: userId,
    }));

    // Insert flashcards
    const { data, error } = await this.supabase.from("flashcards").insert(flashcardsToInsert).select();

    if (error) {
      throw new Error(`Failed to create flashcards: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to create flashcards: No data returned");
    }

    // Transform database rows to DTOs
    const createdFlashcards: FlashcardDTO[] = data.map((row) => ({
      id: row.id,
      front: row.front,
      back: row.back,
      source: row.source as FlashcardSource,
      generation_id: row.generation_id,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return {
      flashcards: createdFlashcards,
      total_created: createdFlashcards.length,
    };
  }
}
