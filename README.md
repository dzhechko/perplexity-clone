# Perplexity AI Clone

A modern search interface with AI-powered search functionality similar to Perplexity AI, built using Next.js, React, and TypeScript.

## Features

- 🔍 AI-powered search using Exa.ai
- 🤖 GPT-4 result summarization
- 🎯 Multiple search modes (Focused/Copilot/Writing)
- ⚡ Real-time search with debouncing
- 📚 Expandable source citations
- 🎨 Modern UI with dark/light mode
- 📱 Fully responsive design

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- OpenAI API key
- Exa.ai API key
- Serper.dev API key (optional)

## Setup

1. Clone the repository:

```bash
git clone [repository-url]
cd perplexity-clone
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:

```env
# Debug mode for detailed logging
NEXT_PUBLIC_DEBUG=true

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1  # or your custom endpoint
OPENAI_MODEL=gpt-4  # or other available models
OPENAI_TEMPERATURE=0.3
OPENAI_MAX_TOKENS=1000

# Search Providers API Keys
NEXT_PUBLIC_EXA_API_KEY=your_exa_api_key_here
NEXT_PUBLIC_SERPER_API_KEY=your_serper_api_key_here  # optional

# Node Environment
NODE_ENV=development
```

Available OpenAI models:
- For standard OpenAI API: gpt-4, gpt-4-turbo-preview, gpt-3.5-turbo
- For custom endpoints: check with your provider

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Search Modes

The application supports three different search modes:

### Focused Mode
- Concise, fact-based answers
- Uses most recent sources (last 24 hours)
- Returns fewer but more relevant results
- Best for: Quick facts and current information

### Copilot Mode
- Detailed explanations with context
- Balanced source selection
- Includes examples and related information
- Best for: Learning and understanding topics

### Writing Mode
- Well-structured, comprehensive responses
- Uses broader time range for sources
- Includes more context and background
- Best for: Content creation and research

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - React components
- `/lib` - Utility functions and API integrations
- `/types` - TypeScript type definitions
- `/hooks` - Custom React hooks

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- OpenAI GPT-4
- Exa.ai Search API
- TanStack Query
- Lucide Icons 