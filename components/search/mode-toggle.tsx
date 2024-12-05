"use client";

import { SearchMode } from '@/types/search';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Target, Pen, Brain } from 'lucide-react';

interface ModeToggleProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex justify-center">
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(value) => value && onModeChange(value as SearchMode)}
        className="justify-center"
      >
        <ToggleGroupItem
          value="focused"
          aria-label="Toggle focused mode"
          className="flex items-center gap-2 px-4"
        >
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Focused</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem
          value="copilot"
          aria-label="Toggle copilot mode"
          className="flex items-center gap-2 px-4"
        >
          <Brain className="h-4 w-4" />
          <span className="hidden sm:inline">Copilot</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem
          value="writing"
          aria-label="Toggle writing mode"
          className="flex items-center gap-2 px-4"
        >
          <Pen className="h-4 w-4" />
          <span className="hidden sm:inline">Writing</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}