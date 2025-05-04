import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        "font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent",
        className
      )}
    >
      10xCards
    </span>
  );
}
