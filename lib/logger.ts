const DEBUG = process.env.DEBUG === 'true';

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (DEBUG) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};

export const searchLogger = {
  searchInitiated: (query: string, provider: string) => {
    logger.info(`Search initiated with query: "${query}" using provider: ${provider}`);
  },
  searchCompleted: (query: string, provider: string, duration: number, resultsCount: number) => {
    logger.info(
      `Search completed for query: "${query}"`,
      {
        provider,
        duration: `${duration.toFixed(2)}ms`,
        resultsCount
      }
    );
  },
  searchError: (query: string, provider: string, error: Error) => {
    logger.error(
      `Search failed for query: "${query}" with provider: ${provider}`,
      error
    );
  },
  providerInitialized: (provider: string) => {
    logger.debug(`Search provider initialized: ${provider}`);
  },
  rateLimitHit: (provider: string) => {
    logger.warn(`Rate limit hit for provider: ${provider}`);
  },
  debugQuery: (originalQuery: string, processedQuery: string) => {
    logger.debug('Query processing:', {
      original: originalQuery,
      processed: processedQuery
    });
  }
};