import { FlashcardSuggestionItem } from "./FlashcardSuggestionItem";
import { EditFlashcardModal } from "./EditFlashcardModal";
import { BulkActions } from "./BulkActions";
import { cn } from "@/lib/utils";
import type { FlashcardSuggestionViewModel } from "./types";
import type { FlashcardCreateDTO } from "@/types";

interface AIGeneratedFlashcardsListProps {
  flashcards: FlashcardSuggestionViewModel[];
  editingFlashcardId: number | null;
  onAccept: (id: number) => void;
  onEdit: (id: number) => void;
  onReject: (id: number) => void;
  onSaveEdit: (id: number, data: FlashcardCreateDTO) => Promise<void>;
  onCancelEdit: () => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  className?: string;
}

export const AIGeneratedFlashcardsList = ({
  flashcards,
  editingFlashcardId,
  onAccept,
  onEdit,
  onReject,
  onSaveEdit,
  onCancelEdit,
  onAcceptAll,
  onRejectAll,
  className,
}: AIGeneratedFlashcardsListProps) => {
  const editingFlashcard = flashcards.find((f) => f.id === editingFlashcardId);

  if (flashcards.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <BulkActions
        onAcceptAll={onAcceptAll}
        onRejectAll={onRejectAll}
        disabled={flashcards.some((f) => f.isProcessing)}
      />

      <div className="space-y-4">
        {flashcards.map((flashcard) => (
          <FlashcardSuggestionItem
            key={flashcard.id}
            flashcard={flashcard}
            onAccept={onAccept}
            onEdit={onEdit}
            onReject={onReject}
          />
        ))}
      </div>

      {editingFlashcard && (
        <EditFlashcardModal
          flashcard={editingFlashcard}
          isOpen={true}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          onReject={onReject}
          isProcessing={editingFlashcard.isProcessing}
          error={editingFlashcard.error}
          onErrorClear={() => onEdit(editingFlashcard.id)}
        />
      )}
    </div>
  );
};
