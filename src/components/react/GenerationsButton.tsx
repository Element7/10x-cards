import { Button } from "@/components/ui/button";

export default function GenerationsButton() {
  return (
    <Button variant="outline" size="sm" className="text-white hover:text-white border-white/20 hover:bg-white/10">
      <a href="/generations">Historia generacji</a>
    </Button>
  );
}
