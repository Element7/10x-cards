import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useValidation } from "./hooks/useValidation";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { cn } from "@/lib/utils";
import type { FlashcardCreateDTO } from "@/types";
import { CheckCircle2 } from "lucide-react";

interface ManualCreationFormProps {
  onSave: (flashcard: FlashcardCreateDTO) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
  onErrorClear: () => void;
  className?: string;
}

export const ManualCreationForm = ({
  onSave,
  isProcessing,
  error,
  onErrorClear,
  className,
}: ManualCreationFormProps) => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { validateFlashcardFront, validateFlashcardBack } = useValidation();

  const frontError = wasSubmitted ? validateFlashcardFront(front.trim()) : null;
  const backError = wasSubmitted ? validateFlashcardBack(back.trim()) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWasSubmitted(true);

    const trimmedFront = front.trim();
    const trimmedBack = back.trim();

    const frontValidationError = validateFlashcardFront(trimmedFront);
    const backValidationError = validateFlashcardBack(trimmedBack);
    if (frontValidationError || backValidationError || isProcessing) return;

    try {
      await onSave({
        front: trimmedFront,
        back: trimmedBack,
        source: "manual",
      });

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Clear form after successful save
      setFront("");
      setBack("");
      setWasSubmitted(false);
    } catch {
      // Error handling is done by the parent component
    }
  };

  const handleInputChange = (field: "front" | "back", value: string) => {
    if (field === "front") {
      setFront(value);
    } else {
      setBack(value);
    }
    if (wasSubmitted) setWasSubmitted(false);
    if (showSuccess) setShowSuccess(false);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-8", className)} data-testid="manual-creation-form">
      <div className="grid gap-8">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="front"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Przód fiszki
            </label>
            <p
              className={cn(
                "text-sm text-muted-foreground",
                wasSubmitted && (front.trim().length === 0 || front.length > 200) && "text-destructive"
              )}
              data-testid="front-character-count"
            >
              {front.trim().length} / 200
            </p>
          </div>
          <Input
            id="front"
            value={front}
            onChange={(e) => handleInputChange("front", e.target.value)}
            placeholder="Wprowadź treść przodu fiszki"
            className="h-12 text-base"
            disabled={isProcessing}
            data-testid="front-input"
          />
          {frontError && (
            <p className="text-sm font-medium text-destructive" data-testid="front-error">
              {frontError}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="back"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tył fiszki
            </label>
            <p
              className={cn(
                "text-sm text-muted-foreground",
                wasSubmitted && (back.trim().length === 0 || back.length > 500) && "text-destructive"
              )}
              data-testid="back-character-count"
            >
              {back.trim().length} / 500
            </p>
          </div>
          <Textarea
            id="back"
            value={back}
            onChange={(e) => handleInputChange("back", e.target.value)}
            placeholder="Wprowadź treść tyłu fiszki"
            className="min-h-[300px] resize-y text-base"
            disabled={isProcessing}
            data-testid="back-input"
          />
          {backError && (
            <p className="text-sm font-medium text-destructive" data-testid="back-error">
              {backError}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" disabled={isProcessing} className="min-w-[140px]" data-testid="save-button">
          {isProcessing ? <LoadingSpinner size="small" /> : "Zapisz fiszkę"}
        </Button>
        {isProcessing && (
          <p className="text-sm text-muted-foreground" data-testid="saving-indicator">
            Zapisywanie fiszki...
          </p>
        )}
        {showSuccess && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600" data-testid="success-message">
            <CheckCircle2 className="h-5 w-5" />
            <span>Fiszka została zapisana</span>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} onClose={onErrorClear} data-testid="error-message" />}
    </form>
  );
};
