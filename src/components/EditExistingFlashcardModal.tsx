import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useValidation } from "./hooks/useValidation";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import type { FlashcardUpdateDTO } from "@/types";
import type { Database } from "@/db/database.types";

type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];

interface EditExistingFlashcardModalProps {
  flashcard: Flashcard;
  isOpen: boolean;
  onSave: (id: string, data: FlashcardUpdateDTO) => Promise<void>;
  onCancel: () => void;
  isProcessing: boolean;
  error: string | null;
  onErrorClear: () => void;
}

export const EditExistingFlashcardModal = ({
  flashcard,
  isOpen,
  onSave,
  onCancel,
  isProcessing,
  error,
  onErrorClear,
}: EditExistingFlashcardModalProps) => {
  const [front, setFront] = useState(flashcard.front);
  const [back, setBack] = useState(flashcard.back);
  const { validateFlashcardFront, validateFlashcardBack } = useValidation();

  // Reset form when flashcard changes
  useEffect(() => {
    setFront(flashcard.front);
    setBack(flashcard.back);
  }, [flashcard]);

  const frontError = validateFlashcardFront(front.trim());
  const backError = validateFlashcardBack(back.trim());
  const hasError = Boolean(frontError || backError);
  const isUnchanged = front.trim() === flashcard.front && back.trim() === flashcard.back;
  const isSaveDisabled = hasError || isProcessing || isUnchanged;

  const handleSave = async () => {
    if (isSaveDisabled) return;

    await onSave(flashcard.id, {
      front: front.trim(),
      back: back.trim(),
      source: "manual",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edytuj fiszkę</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Przód fiszki (max. 200 znaków)"
              disabled={isProcessing}
            />
            {frontError && <p className="text-sm text-destructive">{frontError}</p>}
          </div>

          <div className="space-y-2">
            <Textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Tył fiszki (max. 500 znaków)"
              className="min-h-[100px] resize-y"
              disabled={isProcessing}
            />
            {backError && <p className="text-sm text-destructive">{backError}</p>}
          </div>

          {error && <ErrorMessage message={error} onClose={onErrorClear} />}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
            Anuluj
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaveDisabled}>
            {isProcessing ? <LoadingSpinner size="small" /> : "Zapisz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
