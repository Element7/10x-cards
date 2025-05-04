import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Pencil, X } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { cn } from "@/lib/utils";
import type { FlashcardSuggestionViewModel } from "./types";

interface FlashcardSuggestionItemProps {
  flashcard: FlashcardSuggestionViewModel;
  onAccept: (id: number) => void;
  onEdit: (id: number) => void;
  onReject: (id: number) => void;
  className?: string;
}

export const FlashcardSuggestionItem = ({
  flashcard,
  onAccept,
  onEdit,
  onReject,
  className,
}: FlashcardSuggestionItemProps) => {
  const { id, front, back, isProcessing, error } = flashcard;

  return (
    <Card className={cn("relative overflow-hidden", className)} data-testid={`flashcard-item-${id}`}>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <h3 className="font-medium">Przód</h3>
          <p className="text-sm text-muted-foreground" data-testid="flashcard-front">
            {front}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Tył</h3>
          <p className="text-sm text-muted-foreground" data-testid="flashcard-back">
            {back}
          </p>
        </div>
        {error && <ErrorMessage message={error} className="mt-4" data-testid="flashcard-error" />}
      </CardContent>

      <CardFooter className="flex justify-end gap-2 p-6 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReject(id)}
          disabled={isProcessing}
          data-testid="reject-button"
        >
          <X className="h-4 w-4" />
          <span className="ml-2">Odrzuć</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(id)}
          disabled={isProcessing}
          data-testid="edit-button"
        >
          <Pencil className="h-4 w-4" />
          <span className="ml-2">Edytuj</span>
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => onAccept(id)}
          disabled={isProcessing}
          data-testid="accept-button"
        >
          {isProcessing ? (
            <LoadingSpinner size="small" />
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span className="ml-2">Akceptuj</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
