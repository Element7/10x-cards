import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkActionsProps {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  disabled: boolean;
  className?: string;
}

export const BulkActions = ({ onAcceptAll, onRejectAll, disabled, className }: BulkActionsProps) => {
  return (
    <div className={cn("flex items-center justify-end gap-2", className)}>
      <Button variant="outline" size="sm" onClick={onRejectAll} disabled={disabled}>
        <X className="h-4 w-4" />
        <span className="ml-2">Odrzuć wszystkie</span>
      </Button>
      <Button variant="default" size="sm" onClick={onAcceptAll} disabled={disabled}>
        <Check className="h-4 w-4" />
        <span className="ml-2">Akceptuj wszystkie</span>
      </Button>
    </div>
  );
};
