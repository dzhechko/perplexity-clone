"use client";

import { useState, useRef } from 'react';
import { SearchBar } from './search-bar';
import { ModeToggle } from './mode-toggle';
import { SearchResults } from './search-results';
import { ProviderSelector } from './provider-selector';
import { searchWithProvider } from '@/lib/search';
import { useSearchProvider } from '@/hooks/use-search-provider';
import type { SearchMode, SearchResult, SearchProvider } from '@/types/search';
import { useDebounce } from '@/hooks/use-debounce';

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';

export default function SearchInterface() {
  const [mode, setMode] = useState<SearchMode>('focused');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | undefined>();
  const [query, setQuery] = useState('');
  const { provider, setProvider } = useSearchProvider();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResult(undefined);
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchWithProvider(searchQuery, provider);
      if (DEBUG) {
        console.log('Search result in interface:', result);
      }
      setSearchResult(result);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResult({
        content: 'An error occurred while searching. Please try again.',
        sources: [],
        followUps: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 1500);

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    if (DEBUG) {
      console.log('Search mode changed to:', newMode);
    }
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleFollowUpClick = (question: string) => {
    setQuery(question);
    handleSearch(question);
  };

  const handleProviderChange = (newProvider: SearchProvider) => {
    setProvider(newProvider);
    if (DEBUG) {
      console.log('Search provider changed to:', newProvider);
    }
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar 
              onSearch={handleQueryChange}
              value={query}
              onChange={setQuery}
            />
          </div>
          <ProviderSelector 
            provider={provider} 
            onProviderChange={handleProviderChange}
          />
        </div>
        <ModeToggle mode={mode} onModeChange={handleModeChange} />
      </div>

      <SearchResults
        result={searchResult}
        isLoading={isLoading}
        mode={mode}
        onFollowUpClick={handleFollowUpClick}
      />
    </div>
  );
}