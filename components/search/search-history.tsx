"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Trash2 } from "lucide-react";
import type { SearchHistory } from '@/types/search';

interface SearchHistoryProps {
  history: SearchHistory[];
  onSelect: (query: string) => void;
  onClear: () => void;
}

export function SearchHistory({ history, onSelect, onClear }: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between p-2 border-b">
        <span className="text-sm font-medium flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Recent Searches
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="max-h-[200px]">
        {history.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-sm px-4 py-2"
            onClick={() => onSelect(item.query)}
          >
            {item.query}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}