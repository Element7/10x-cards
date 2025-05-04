import { useState } from "react";
import type { GenerationMode, GenerationViewState } from "../types";
import { mapGenerationResponseToState } from "../types";
import type { FlashcardCreateDTO, GenerationCreateDTO } from "@/types";

export const useGenerationState = () => {
  const [state, setState] = useState<GenerationViewState>({
    mode: "ai",
    isGenerating: false,
    generationError: null,
    flashcardSuggestions: [],
    generationId: null,
    editingFlashcardId: null,
  });

  const setMode = (mode: GenerationMode) => {
    setState((prev) => ({
      ...prev,
      mode,
      // Reset state when switching modes
      flashcardSuggestions: [],
      generationId: null,
      generationError: null,
      editingFlashcardId: null,
    }));
  };

  const generateFlashcards = async (sourceText: string) => {
    setState((prev) => ({ ...prev, isGenerating: true, generationError: null }));

    try {
      const requestData: GenerationCreateDTO = {
        source_text: sourceText,
      };

      const response = await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Błąd podczas generacji fiszek");
      }

      const data = await response.json();
      setState((prev) => ({ ...prev, ...mapGenerationResponseToState(data) }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        generationError: error instanceof Error ? error.message : "Nieznany błąd",
        isGenerating: false,
      }));
    }
  };

  const createFlashcard = async (flashcard: FlashcardCreateDTO) => {
    // For AI-generated flashcards, update the UI state immediately
    if (flashcard.source === "ai_full" || flashcard.source === "ai_edited") {
      const id =
        state.editingFlashcardId ??
        state.flashcardSuggestions.find((f) => f.front === flashcard.front && f.back === flashcard.back)?.id;

      if (!id) return;

      const originalFlashcard = state.flashcardSuggestions.find((f) => f.id === id);
      if (!originalFlashcard) return;

      // Remove the flashcard from suggestions immediately
      setState((prev) => ({
        ...prev,
        flashcardSuggestions: prev.flashcardSuggestions.filter((f) => f.id !== id),
        editingFlashcardId: null,
      }));

      try {
        // Simulate error after 3 seconds

        const response = await fetch("/api/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flashcards: [flashcard] }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Błąd podczas zapisywania fiszki");
        }
      } catch (error) {
        // Restore the original flashcard with error
        setState((prev) => ({
          ...prev,
          flashcardSuggestions: [
            ...prev.flashcardSuggestions,
            { ...originalFlashcard, error: error instanceof Error ? error.message : "Nieznany błąd" },
          ],
        }));
      }
    } else {
      // For manual flashcards, just make the API call
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcards: [flashcard] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Błąd podczas zapisywania fiszki");
      }
    }
  };

  const editFlashcard = (id: number) => {
    setState((prev) => ({ ...prev, editingFlashcardId: id }));
  };

  const rejectFlashcard = (id: number) => {
    setState((prev) => ({
      ...prev,
      flashcardSuggestions: prev.flashcardSuggestions.filter((f) => f.id !== id),
    }));
  };

  const rejectAllFlashcards = () => {
    setState((prev) => ({
      ...prev,
      flashcardSuggestions: [],
      generationId: null,
    }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, generationError: null }));
  };

  return {
    state,
    setMode,
    generateFlashcards,
    createFlashcard,
    editFlashcard,
    rejectFlashcard,
    rejectAllFlashcards,
    clearError,
  };
};
