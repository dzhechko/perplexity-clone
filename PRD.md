# Perplexity AI Clone - Product Requirements Documentation

## 1. Project Overview

### 1.1 Introduction
A modern search interface that combines AI-powered search capabilities with real-time summarization, providing users with concise, contextual answers and relevant sources.

### 1.2 Objectives
- Create a user-friendly search interface similar to Perplexity AI
- Implement multiple search modes for different use cases
- Provide real-time search results with AI summarization
- Ensure source transparency and citation
- Support dark/light theme modes
- Make the interface responsive and accessible

### 1.3 Target Audience
- Researchers
- Students
- Content creators
- General users looking for detailed, sourced information

### 1.4 Technical Stack
- Frontend: Next.js 14, React 18, TypeScript
- Styling: Tailwind CSS, shadcn/ui
- Search Providers: Exa.ai, Serper.dev
- AI: OpenAI GPT models
- State Management: React Context
- Development: Docker, ESLint

## 2. Core Functionalities

### 2.1 Search Interface

#### Search Bar Component
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
  onChange: (value: string) => void;
}

// Features:
- Real-time search with debouncing (1.5s delay)
- Search history tracking
- Loading state indication
- Clear button
```

#### Search Modes
```typescript
type SearchMode = 'focused' | 'copilot' | 'writing';

interface ModeConfig {
  resultCount: number;
  timeRange: string;
  prompt: string;
}

const modeConfigs: Record<SearchMode, ModeConfig> = {
  focused: {
    resultCount: 3,
    timeRange: 'day',
    prompt: 'Provide concise, fact-based answer'
  },
  copilot: {
    resultCount: 5,
    timeRange: 'week',
    prompt: 'Provide detailed explanation with context'
  },
  writing: {
    resultCount: 8,
    timeRange: 'month',
    prompt: 'Provide comprehensive, structured response'
  }
};
```

#### Search Results Display
```typescript
interface SearchResult {
  content: string;
  sources: SearchSource[];
  followUps: string[];
  error?: string;
  rawResults?: RawSearchResult[];
}

interface SearchSource {
  title: string;
  url: string;
  snippet: string;
}
```

### 2.2 Theme Switching
```typescript
interface ThemeProviderProps {
  defaultTheme: 'light' | 'dark' | 'system';
  enableSystem: boolean;
}
```

### 2.3 Provider Selection
```typescript
type SearchProvider = 'exa' | 'serper';

interface ProviderConfig {
  icon: IconComponent;
  label: string;
  apiKey: string;
}
```

## 3. Documentation

### 3.1 Exa.ai Integration

```typescript
async function searchWithExa(query: string, mode: SearchMode): Promise<SearchResult> {
  const response = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_EXA_API_KEY
    },
    body: JSON.stringify({
      query,
      numResults: modeConfigs[mode].resultCount,
      useAutoprompt: true,
      livecrawl: "always",
      text: true,
      source_type: mode === 'writing' ? "news,blog" : "news",
      time_sort: modeConfigs[mode].timeRange
    })
  });

  // Process and return results
}
```

### 3.2 Serper Integration

```typescript
async function searchWithSerper(query: string, mode: SearchMode): Promise<SearchResult> {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': process.env.NEXT_PUBLIC_SERPER_API_KEY
    },
    body: JSON.stringify({
      q: query,
      num: modeConfigs[mode].resultCount,
      type: mode === 'writing' ? 'news' : 'search',
      timeRange: modeConfigs[mode].timeRange
    })
  });

  // Process and return results
}
```

### 3.3 OpenAI Integration

```typescript
async function summarizeResults(
  searchResults: RawSearchResult[],
  query: string,
  mode: SearchMode
): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: modeConfigs[mode].prompt
      },
      {
        role: "user",
        content: `Query: "${query}"\n\nSearch Results:\n${formatResults(searchResults)}`
      }
    ],
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 1000
  });

  return completion.choices[0]?.message?.content || 'No summary generated';
}
```

## 4. Project File Structure

```
project/
├── app/
│   ├── api/
│   │   └── summarize/
│   │       └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── search/
│   │   ├── search-interface.tsx
│   │   ├── search-bar.tsx
│   │   ├── search-results.tsx
│   │   ├── mode-toggle.tsx
│   │   └── provider-selector.tsx
│   ├── ui/
│   │   └── [shadcn components]
│   └── theme-provider.tsx
├── lib/
│   ├── search.ts
│   ├── openai.ts
│   └── logger.ts
├── types/
│   └── search.ts
├── hooks/
│   ├── use-debounce.ts
│   └── use-search-provider.ts
├── public/
│   └── [static files]
├── styles/
│   └── [style files]
├── .env.example
├── .env.local
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Key Files Description

- `search-interface.tsx`: Main search component orchestrating all functionality
- `search.ts`: Search provider integrations and result processing
- `summarize/route.ts`: OpenAI integration for result summarization
- `use-debounce.ts`: Custom hook for search input debouncing
- `use-search-provider.ts`: Provider selection and management
- `logger.ts`: Debugging and error tracking utilities

### Environment Variables

```env
# Debug mode
NEXT_PUBLIC_DEBUG=true/false

# OpenAI Configuration
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.3
OPENAI_MAX_TOKENS=1000

# Search Providers
NEXT_PUBLIC_EXA_API_KEY=your_key
NEXT_PUBLIC_SERPER_API_KEY=your_key

# Node Environment
NODE_ENV=development/production
``` 