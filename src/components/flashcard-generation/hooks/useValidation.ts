/**
 * Hook for validating flashcard generation inputs
 */
export const useValidation = () => {
  const validateSourceText = (text: string): string | null => {
    if (!text) return "Tekst źródłowy jest wymagany";
    if (text.length < 1000) return "Tekst musi mieć co najmniej 1000 znaków";
    if (text.length > 10000) return "Tekst nie może przekraczać 10000 znaków";
    return null;
  };

  const validateFlashcardFront = (text: string): string | null => {
    if (!text) return "Przód fiszki jest wymagany";
    if (text.length > 200) return "Przód fiszki nie może przekraczać 200 znaków";
    return null;
  };

  const validateFlashcardBack = (text: string): string | null => {
    if (!text) return "Tył fiszki jest wymagany";
    if (text.length > 500) return "Tył fiszki nie może przekraczać 500 znaków";
    return null;
  };

  return {
    validateSourceText,
    validateFlashcardFront,
    validateFlashcardBack,
  };
};
