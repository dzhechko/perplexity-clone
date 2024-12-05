import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.3');
const OPENAI_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '800', 10);
const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const requestTimestamps: number[] = [];

function isRateLimited(): boolean {
  const now = Date.now();
  // Remove timestamps older than the window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW) {
    requestTimestamps.shift();
  }
  return requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW;
}

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  defaultQuery: undefined,
  timeout: 30000 // 30 seconds timeout
});

// Fallback summarization without OpenAI
function generateFallbackSummary(searchResults: any[]): string {
  const topResult = searchResults[0];
  return `Based on the search results, here's a direct summary from the top source (${topResult.title}):
${topResult.content}\nNote: This is a fallback summary due to API limitations.`;
}

export async function POST(request: Request) {
  try {
    // Check rate limit
    if (isRateLimited()) {
      if (DEBUG) console.log('Rate limit exceeded');
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { searchResults, autoprompt, query } = await request.json();

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      return NextResponse.json(
        { error: 'Invalid search results format' },
        { status: 400 }
      );
    }

    if (DEBUG) {
      console.log('Summarization request:', { 
        searchResults, 
        autoprompt, 
        query,
        model: OPENAI_MODEL,
        temperature: OPENAI_TEMPERATURE,
        maxTokens: OPENAI_MAX_TOKENS
      });
    }

    // Add timestamp for rate limiting
    requestTimestamps.push(Date.now());

    // Format results with metadata
    const formattedContent = searchResults
      .map((result, index) => {
        const date = result.publishedDate ? new Date(result.publishedDate).toLocaleDateString() : 'Unknown date';
        return `[Source ${index + 1}] ${result.title} (${date}, Score: ${result.score})
Content: ${result.content}`;
      })
      .join('\n\n');

    try {
      // Prepare messages for OpenAI
      const messages = [
        {
          role: "system" as const,
          content: autoprompt || `You are a helpful assistant that summarizes search results.`
        },
        {
          role: "user" as const,
          content: `Query: "${query}"\n\nSearch Results:\n${formattedContent}`
        }
      ];

      if (DEBUG) {
        console.log('=== OpenAI Request ===');
        console.log(JSON.stringify({
          messages,
          model: OPENAI_MODEL,
          temperature: OPENAI_TEMPERATURE,
          maxTokens: OPENAI_MAX_TOKENS
        }, null, 2));
      }

      const completion = await openai.chat.completions.create({
        messages,
        model: OPENAI_MODEL,
        temperature: OPENAI_TEMPERATURE,
        max_tokens: OPENAI_MAX_TOKENS,
        stream: false
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new Error('No completion choices returned from OpenAI');
      }

      const summary = completion.choices[0]?.message?.content || 'No summary generated';

      if (DEBUG) {
        console.log('=== OpenAI Response ===');
        console.log(summary);
      }

      return NextResponse.json({ summary });
    } catch (apiError: any) {
      if (DEBUG) {
        console.error('OpenAI API Error:', {
          message: apiError.message,
          status: apiError.status,
          code: apiError.code,
          type: apiError.type,
          model: OPENAI_MODEL
        });
      }

      // Handle specific API errors
      if (apiError.code === 'insufficient_quota') {
        const fallbackSummary = generateFallbackSummary(searchResults);
        return NextResponse.json({ 
          summary: fallbackSummary,
          warning: 'Using fallback summarization due to API limitations'
        });
      }

      // For other API errors, return a more specific error message
      return NextResponse.json(
        { 
          error: 'OpenAI API Error',
          details: DEBUG ? apiError.message : 'Failed to generate summary'
        },
        { status: apiError.status || 500 }
      );
    }
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: DEBUG ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
} 