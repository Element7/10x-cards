import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

export const ErrorMessage = ({ message, onClose, className }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <Alert variant="destructive" className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        <XCircle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </div>
      {onClose && (
        <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-destructive/20" onClick={onClose}>
          Zamknij
        </Button>
      )}
    </Alert>
  );
};
