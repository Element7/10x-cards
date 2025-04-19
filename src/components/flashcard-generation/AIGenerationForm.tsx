import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useValidation } from "./hooks/useValidation";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { cn } from "@/lib/utils";

interface AIGenerationFormProps {
  onGenerate: (sourceText: string) => Promise<void>;
  isGenerating: boolean;
  error: string | null;
  onErrorClear: () => void;
  className?: string;
}

export const AIGenerationForm = ({
  onGenerate,
  isGenerating,
  error,
  onErrorClear,
  className,
}: AIGenerationFormProps) => {
  const [sourceText, setSourceText] = useState("");
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const { validateSourceText } = useValidation();
  const validationError = wasSubmitted ? validateSourceText(sourceText) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWasSubmitted(true);

    const error = validateSourceText(sourceText);
    if (error || isGenerating) return;

    await onGenerate(sourceText);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
    if (wasSubmitted) setWasSubmitted(false);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="sourceText"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tekst źródłowy
            </label>
            <p
              className={cn(
                "text-sm text-muted-foreground",
                wasSubmitted && sourceText.length < 1000 && "text-destructive",
                wasSubmitted && sourceText.length > 10000 && "text-destructive"
              )}
            >
              {sourceText.length} / 10000
            </p>
          </div>
          <Textarea
            id="sourceText"
            value={sourceText}
            onChange={handleTextChange}
            placeholder="Wprowadź tekst źródłowy (min. 1000 znaków)"
            className="min-h-[400px] resize-y font-mono text-sm"
            disabled={isGenerating}
          />
          <p className="text-sm text-muted-foreground">Min. 1000 znaków, max. 10000 znaków</p>
          {validationError && <p className="text-sm font-medium text-destructive">{validationError}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" size="lg" disabled={isGenerating} className="min-w-[140px]">
          {isGenerating ? <LoadingSpinner size="small" /> : "Generuj fiszki"}
        </Button>
        {isGenerating && <p className="text-sm text-muted-foreground">Generowanie może potrwać kilka sekund...</p>}
      </div>

      {error && <ErrorMessage message={error} onClose={onErrorClear} />}
    </form>
  );
};
