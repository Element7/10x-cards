import { Toggle } from "@/components/ui/toggle";
import { Brain, PencilLine } from "lucide-react";
import type { GenerationMode } from "./types";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  currentMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  className?: string;
}

export const ModeToggle = ({ currentMode, onModeChange, className }: ModeToggleProps) => {
  return (
    <div className={cn("flex gap-3", className)}>
      <Toggle
        pressed={currentMode === "ai"}
        onPressedChange={() => onModeChange("ai")}
        aria-label="Tryb AI"
        variant="outline"
        size="lg"
        className="flex-1 gap-3 border-2 data-[state=on]:border-primary data-[state=on]:bg-primary/10"
      >
        <Brain className="h-5 w-5" />
        <span className="text-base">Generuj z AI</span>
      </Toggle>
      <Toggle
        pressed={currentMode === "manual"}
        onPressedChange={() => onModeChange("manual")}
        aria-label="Tryb manualny"
        variant="outline"
        size="lg"
        className="flex-1 gap-3 border-2 data-[state=on]:border-primary data-[state=on]:bg-primary/10"
        data-testid="manual-mode-button"
      >
        <PencilLine className="h-5 w-5" />
        <span className="text-base">Twórz ręcznie</span>
      </Toggle>
    </div>
  );
};
