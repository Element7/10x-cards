import { ModeToggle } from "./ModeToggle";
import { AIGenerationForm } from "./AIGenerationForm";
import { ManualCreationForm } from "./ManualCreationForm";
import { AIGeneratedFlashcardsList } from "./AIGeneratedFlashcardsList";
import { useGenerationState } from "./hooks/useGenerationState";
import type { FlashcardCreateDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

export const FlashcardGenerationView = () => {
  const {
    state,
    setMode,
    generateFlashcards,
    createFlashcard,
    editFlashcard,
    rejectFlashcard,
    rejectAllFlashcards,
    clearError,
  } = useGenerationState();

  const handleAcceptFlashcard = async (id: number) => {
    const flashcard = state.flashcardSuggestions.find((f) => f.id === id);
    if (!flashcard) return;

    await createFlashcard({
      front: flashcard.front,
      back: flashcard.back,
      source: "ai_full",
      generation_id: state.generationId,
    });
  };

  const handleAcceptAllFlashcards = async () => {
    // Process flashcards sequentially to avoid overwhelming the server
    for (const flashcard of state.flashcardSuggestions) {
      await createFlashcard({
        front: flashcard.front,
        back: flashcard.back,
        source: "ai_full",
        generation_id: state.generationId,
      });
    }
  };

  const handleSaveEdit = async (id: number, data: FlashcardCreateDTO) => {
    await createFlashcard({
      ...data,
      generation_id: state.generationId,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-muted/5 py-12">
      <div className="container max-w-3xl px-4">
        <div className="mb-12 flex flex-col items-center space-y-6 text-center">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Generowanie fiszek</h1>
            <Button variant="outline" size="sm" asChild>
              <a href="/generations" className="flex items-center gap-2">
                <History size={16} />
                Historia generacji
              </a>
            </Button>
          </div>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Wybierz tryb generowania fiszek - automatycznie z pomocą AI lub ręcznie.
          </p>
          <ModeToggle currentMode={state.mode} onModeChange={setMode} className="w-full max-w-md" />
        </div>

        <div className="space-y-8">
          {state.mode === "ai" ? (
            <>
              <div className="rounded-xl border bg-card p-8 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold">Generowanie z AI</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Wprowadź tekst źródłowy, a AI wygeneruje propozycje fiszek. Następnie możesz je zaakceptować,
                    edytować lub odrzucić.
                  </p>
                </div>
                <AIGenerationForm
                  onGenerate={generateFlashcards}
                  isGenerating={state.isGenerating}
                  error={state.generationError}
                  onErrorClear={clearError}
                />
              </div>

              <AIGeneratedFlashcardsList
                flashcards={state.flashcardSuggestions}
                editingFlashcardId={state.editingFlashcardId}
                onAccept={handleAcceptFlashcard}
                onEdit={editFlashcard}
                onReject={rejectFlashcard}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => editFlashcard(0)}
                onAcceptAll={handleAcceptAllFlashcards}
                onRejectAll={rejectAllFlashcards}
              />
            </>
          ) : (
            <div className="rounded-xl border bg-card p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-xl font-semibold">Tworzenie ręczne</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Wprowadź treść przodu i tyłu fiszki. Możesz utworzyć dowolną liczbę fiszek.
                </p>
              </div>
              <ManualCreationForm
                onSave={createFlashcard}
                isProcessing={state.isGenerating}
                error={state.generationError}
                onErrorClear={clearError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
