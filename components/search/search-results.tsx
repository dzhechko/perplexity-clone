"use client";

import { SearchResult, SearchMode } from '@/types/search';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export interface SearchResultsProps {
  result?: SearchResult;
  isLoading: boolean;
  mode: SearchMode;
  onFollowUpClick?: (question: string) => void;
}

export function SearchResults({ result, isLoading, mode, onFollowUpClick }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-muted rounded-lg" />
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 p-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="w-[300px] h-[200px] bg-muted rounded-lg flex-shrink-0" />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Sort sources by score if available
  const sortedSources = [...result.sources].sort((a, b) => {
    const scoreA = result.rawResults?.find(r => r.title === a.title)?.score || 0;
    const scoreB = result.rawResults?.find(r => r.title === b.title)?.score || 0;
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-6">
      {/* Main content */}
      <Card className="p-6">
        <div className="prose dark:prose-invert max-w-none">
          <p>{result.content}</p>
        </div>
      </Card>

      {/* Sources in horizontal scroll */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sources</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
          <div className="flex space-x-4 p-4">
            {sortedSources.map((source, index) => {
              const score = result.rawResults?.find(r => r.title === source.title)?.score;
              return (
                <Card 
                  key={index} 
                  className="w-[300px] flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm line-clamp-2 flex-grow">{source.title}</h3>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 ml-2 flex-shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    {score && (
                      <div className="text-xs text-muted-foreground mb-2">
                        Relevance: {(score * 100).toFixed(1)}%
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {source.snippet}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Follow-up suggestions */}
      {result.followUps.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Follow-up questions</h2>
          <div className="flex flex-wrap gap-2">
            {result.followUps.map((followUp, index) => (
              <Button
                key={index}
                variant="outline"
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onFollowUpClick?.(followUp)}
              >
                {followUp}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}