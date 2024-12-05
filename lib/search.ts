import { SearchProvider, SearchResult, SearchMode } from '@/types/search';
import { searchLogger } from './logger';

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';
const EXA_API_KEY = process.env.NEXT_PUBLIC_EXA_API_KEY;
const SERPER_API_KEY = process.env.NEXT_PUBLIC_SERPER_API_KEY;

// Mode-specific prompts
const MODE_PROMPTS = {
  focused: "Provide a concise and direct answer focusing only on the most relevant facts.",
  copilot: "Act as an AI assistant. Provide a detailed explanation with context, examples, and related information.",
  writing: "Provide a well-structured response suitable for content writing, with clear sections and key points."
};

// Mode-specific result counts
const MODE_RESULT_COUNTS = {
  focused: 3,  // Fewer results for focused mode
  copilot: 5,  // Medium amount for copilot mode
  writing: 8   // More results for writing mode
};

// Validate API keys
function validateApiKeys(provider: SearchProvider): void {
  switch (provider) {
    case 'exa':
      if (!EXA_API_KEY) {
        throw new Error('Exa API key is not configured');
      }
      break;
    case 'serper':
      if (!SERPER_API_KEY) {
        throw new Error('Serper API key is not configured');
      }
      break;
  }
}

export async function searchWithProvider(
  query: string,
  provider: SearchProvider,
  mode: SearchMode = 'focused' // Default to focused mode
): Promise<SearchResult> {
  try {
    validateApiKeys(provider);
    searchLogger.searchInitiated(query, provider);
    
    const resultCount = MODE_RESULT_COUNTS[mode];
    const prompt = MODE_PROMPTS[mode];
    
    let result: SearchResult;
    switch (provider) {
      case 'exa':
        result = await searchWithExa(query, mode, resultCount);
        break;
      case 'serper':
        result = await searchWithSerper(query, mode, resultCount);
        break;
      default:
        throw new Error(`Unsupported search provider: ${provider}`);
    }

    searchLogger.searchCompleted(query, provider, 0, result.sources.length);
    return result;
  } catch (error) {
    searchLogger.searchError(query, provider, error as Error);
    return {
      content: getErrorMessage(error),
      sources: [],
      followUps: [
        'Try switching to a different search provider',
        'Try rephrasing your search query'
      ],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return 'Search provider is not properly configured. Please try a different provider.';
    }
    if (error.message.includes('403')) {
      return 'Access denied. Please check API key configuration.';
    }
    if (error.message.includes('429')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (error.message.includes('5')) {
      return 'Search service is temporarily unavailable. Please try again later.';
    }
  }
  return 'An error occurred while searching. Please try again or switch providers.';
}

async function searchWithExa(
  query: string, 
  mode: SearchMode,
  resultCount: number
): Promise<SearchResult> {
  try {
    const searchResponse = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EXA_API_KEY || ''
      },
      body: JSON.stringify({
        query,
        numResults: resultCount,
        useAutoprompt: true,
        livecrawl: "always",
        text: true,
        ...(mode === 'writing' && {
          source_type: "news,blog",
          time_sort: "last_month"
        }),
        ...(mode === 'focused' && {
          source_type: "news",
          time_sort: "last_day"
        })
      })
    });

    if (!searchResponse.ok) {
      throw new Error(`Exa API error: ${searchResponse.statusText} (${searchResponse.status})`);
    }

    const searchData = await searchResponse.json();
    
    if (DEBUG) {
      console.log('Exa search results:', searchData);
    }

    if (!searchData.results || !Array.isArray(searchData.results) || searchData.results.length === 0) {
      throw new Error('No search results found');
    }

    // Extract text content and prepare for summarization
    const searchResults = searchData.results.map((result: any) => ({
      title: result.title || 'Untitled',
      content: result.text || result.content || result.snippet || 'No content available',
      url: result.url || '#',
      score: typeof result.score === 'number' ? result.score : 1,
      publishedDate: result.publishedDate || new Date().toISOString()
    }));

    // Call summarize API with mode-specific prompt
    const summaryResponse = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchResults,
        autoprompt: MODE_PROMPTS[mode],
        query
      })
    });

    if (!summaryResponse.ok) {
      const errorData = await summaryResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to generate summary: ${summaryResponse.statusText}`);
    }

    const summaryData = await summaryResponse.json();

    if (DEBUG) {
      console.log('Summary response:', summaryData);
    }

    // Format sources for display with safe string operations
    const sources = searchResults.map((result: any) => ({
      title: result.title,
      url: result.url,
      snippet: result.content ? result.content.substring(0, Math.min(200, result.content.length)) + (result.content.length > 200 ? '...' : '') : 'No content available'
    }));

    // Generate mode-specific follow-up questions
    const followUps = generateFollowUpQuestions(query, mode);

    return {
      content: summaryData.summary,
      sources,
      followUps,
      rawResults: searchResults
    };
  } catch (error) {
    console.error('Exa search error:', error);
    throw error;
  }
}

async function searchWithSerper(
  query: string,
  mode: SearchMode,
  resultCount: number
): Promise<SearchResult> {
  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': SERPER_API_KEY || ''
      },
      body: JSON.stringify({
        q: query,
        num: resultCount,
        ...(mode === 'writing' && {
          type: 'news',
          timeRange: 'month'
        }),
        ...(mode === 'focused' && {
          type: 'search',
          timeRange: 'day'
        })
      })
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    
    if (DEBUG) {
      console.log('Serper search results:', data);
    }

    if (!data.organic || !Array.isArray(data.organic) || data.organic.length === 0) {
      throw new Error('No search results found');
    }

    // Format results for summarization
    const searchResults = data.organic.map((result: any) => ({
      title: result.title || 'Untitled',
      content: result.snippet || 'No content available',
      url: result.link || '#',
      score: 1,
      publishedDate: new Date().toISOString()
    }));

    // Call summarize API with mode-specific prompt
    const summaryResponse = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchResults,
        autoprompt: MODE_PROMPTS[mode],
        query
      })
    });

    if (!summaryResponse.ok) {
      const errorData = await summaryResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to generate summary: ${summaryResponse.statusText}`);
    }

    const summaryData = await summaryResponse.json();

    return {
      content: summaryData.summary,
      sources: data.organic.map((result: any) => ({
        title: result.title || 'Untitled',
        url: result.link || '#',
        snippet: result.snippet || 'No content available'
      })),
      followUps: generateFollowUpQuestions(query, mode),
      rawResults: searchResults
    };
  } catch (error) {
    console.error('Serper search error:', error);
    throw error;
  }
}

function generateFollowUpQuestions(query: string, mode: SearchMode): string[] {
  const baseQuestions = [
    `What are the latest developments about ${query}?`,
    `Can you explain more about the impact of ${query}?`
  ];

  switch (mode) {
    case 'focused':
      // Specific, fact-based questions
      if (query.toLowerCase().includes('stock') || query.toLowerCase().includes('price')) {
        const company = query.split(' ')[0];
        return [
          `What is ${company}'s market cap?`,
          `What are ${company}'s recent earnings?`,
          `What are analysts saying about ${company} stock?`
        ];
      }
      return [
        `What are the key facts about ${query}?`,
        `What are the latest statistics about ${query}?`
      ];

    case 'copilot':
      // Exploratory and analytical questions
      return [
        `How does ${query} compare to alternatives?`,
        `What are the pros and cons of ${query}?`,
        `What are expert opinions about ${query}?`,
        `What are common misconceptions about ${query}?`
      ];

    case 'writing':
      // Content creation oriented questions
      return [
        `What are the trending topics related to ${query}?`,
        `What are the historical developments of ${query}?`,
        `What are the future predictions for ${query}?`,
        `What are the different perspectives on ${query}?`,
        `How has ${query} evolved over time?`
      ];

    default:
      return baseQuestions;
  }
}