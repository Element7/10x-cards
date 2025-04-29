import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { DeleteFlashcardButton } from "./DeleteFlashcardButton";
import type { Database } from "@/db/database.types";
import { EditExistingFlashcardModal } from "./EditExistingFlashcardModal";
import type { FlashcardUpdateDTO } from "@/types";
import { toast } from "sonner";

type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];

interface FlashcardsListProps {
  initialFlashcards: Flashcard[];
  currentPage: number;
}

export function FlashcardsList({ initialFlashcards, currentPage }: FlashcardsListProps) {
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFlashcards(initialFlashcards);
  }, [initialFlashcards]);

  const handleDelete = (id: string) => {
    setFlashcards((prev) => prev.filter((f) => f.id !== id));
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
  };

  const handleSaveEdit = async (id: string, data: FlashcardUpdateDTO) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`/api/flashcards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Błąd podczas aktualizacji fiszki");
      }

      const updatedFlashcard = await response.json();
      setFlashcards((prev) => prev.map((f) => (f.id === id ? { ...f, ...updatedFlashcard } : f)));
      setEditingFlashcard(null);
      toast.success("Fiszka została zaktualizowana");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Nieznany błąd");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingFlashcard(null);
    setError(null);
  };

  useEffect(() => {
    // If we deleted the last item and we're not on the first page, redirect
    if (flashcards.length === 1 && currentPage > 1) {
      window.location.href = `/flashcards?page=${currentPage - 1}`;
      return;
    }

    // If we deleted the last item on the first page, stay but don't redirect
    if (flashcards.length === 1 && currentPage === 1) {
      return;
    }

    // If the page is now empty (except first page), redirect to previous page
    if (flashcards.length === 0 && currentPage > 1) {
      window.location.href = `/flashcards?page=${currentPage - 1}`;
    }
  }, [flashcards.length, currentPage]);

  if (flashcards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nie masz jeszcze żadnych fiszek</CardTitle>
          <CardDescription>Rozpocznij naukę generując swoje pierwsze fiszki</CardDescription>
        </CardHeader>
        <CardFooter>
          <a href="/flashcards/generate">
            <Button>Generuj fiszki</Button>
          </a>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {flashcards.map((flashcard) => (
        <Card key={flashcard.id}>
          <CardHeader>
            <CardTitle>{flashcard.front}</CardTitle>
            <CardDescription>{flashcard.back}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Źródło:{" "}
              {flashcard.source === "manual"
                ? "Ręcznie utworzone"
                : flashcard.source === "ai_full"
                  ? "Wygenerowane przez AI"
                  : "Edytowane"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => handleEdit(flashcard)}>
              Edytuj
            </Button>
            <DeleteFlashcardButton flashcardId={flashcard.id} onDelete={() => handleDelete(flashcard.id)} />
          </CardFooter>
        </Card>
      ))}

      {editingFlashcard && (
        <EditExistingFlashcardModal
          flashcard={editingFlashcard}
          isOpen={true}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          isProcessing={isProcessing}
          error={error}
          onErrorClear={() => setError(null)}
        />
      )}
    </div>
  );
}
