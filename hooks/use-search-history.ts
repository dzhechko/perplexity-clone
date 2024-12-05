"use client";

import { useState, useEffect } from 'react';
import type { SearchHistory, SearchProvider } from '@/types/search';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistory[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const addToHistory = (query: string, provider: SearchProvider) => {
    const newHistory = [
      { query, provider, timestamp: Date.now() },
      ...history.filter(item => item.query !== query),
    ].slice(0, MAX_HISTORY);
    
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return { history, addToHistory, clearHistory };
}