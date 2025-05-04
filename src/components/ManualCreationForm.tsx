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
        <div className="space-y-2">
          <label htmlFor="front" className="text-sm font-medium">
            Przód fiszki
          </label>
          <Input
            id="front"
            aria-label="Przód fiszki"
            value={front}
            onChange={(e) => handleInputChange("front", e.target.value)}
            placeholder="Przód fiszki (max. 200 znaków)"
            disabled={isProcessing}
          />
          {frontError && <p className="text-sm text-destructive">{frontError}</p>}
          <p className="text-sm text-muted-foreground">{front.length} / 200</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="back" className="text-sm font-medium">
            Tył fiszki
          </label>
          <Textarea
            id="back"
            aria-label="Tył fiszki"
            value={back}
            onChange={(e) => handleInputChange("back", e.target.value)}
            placeholder="Tył fiszki (max. 500 znaków)"
            className="min-h-[100px] resize-y"
            disabled={isProcessing}
          />
          {backError && <p className="text-sm text-destructive">{backError}</p>}
          <p className="text-sm text-muted-foreground">{back.length} / 500</p>
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
