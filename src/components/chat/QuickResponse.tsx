import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface QuickResponseProps {
  onPromptClick: (prompt: string) => void;
}

export function QuickResponse({ onPromptClick }: QuickResponseProps) {
  const hardcodedResponses = [
    "I want to eat like a kpop idol",
    "I want to lose weight",
    "I want to become Arnold Schwarzenegger",
  ];

  return (
    <div className="mb-4 flex flex-wrap justify-end gap-2">
      {hardcodedResponses.map((response) => (
        <Button
          key={response}
          variant="outline"
          size="sm"
          onClick={() => onPromptClick(response)}
          className="flex items-center gap-2 rounded-full text-xs"
        >
          {response}
        </Button>
      ))}
    </div>
  );
}
