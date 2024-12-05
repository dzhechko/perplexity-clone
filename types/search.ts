export type SearchProvider = 'exa' | 'serper';

export interface SearchSource {
  title: string;
  url: string;
  snippet: string;
}

export interface RawSearchResult {
  title: string;
  content: string;
  score: number;
  url: string;
  publishedDate?: string;
}

export interface SearchResult {
  content: string;
  sources: SearchSource[];
  followUps: string[];
  error?: string;
  rawResults?: RawSearchResult[];
}

export type SearchMode = 'focused' | 'copilot' | 'writing';

export interface SearchHistory {
  query: string;
  timestamp: number;
  result?: SearchResult;
}