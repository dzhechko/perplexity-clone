"use client";

import { useState, useEffect } from 'react';
import type { SearchProvider } from '@/types/search';

const PROVIDER_KEY = 'search_provider';

export function useSearchProvider() {
  const [provider, setProvider] = useState<SearchProvider>('exa');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROVIDER_KEY);
      if (stored && ['exa', 'custom', 'serper'].includes(stored)) {
        setProvider(stored as SearchProvider);
      }
    } catch (error) {
      console.error('Error reading provider from localStorage:', error);
    }
  }, []);

  const handleProviderChange = (newProvider: SearchProvider) => {
    try {
      setProvider(newProvider);
      localStorage.setItem(PROVIDER_KEY, newProvider);
    } catch (error) {
      console.error('Error saving provider to localStorage:', error);
    }
  };

  return { 
    provider, 
    setProvider: handleProviderChange 
  };
}