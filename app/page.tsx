import { Suspense } from 'react';
import SearchInterface from '@/components/search/search-interface';
import { SearchErrorBoundary } from '@/components/search/search-error-boundary';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-background">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold text-center mb-12">
          Where knowledge begins
        </h1>
        
        <SearchErrorBoundary>
          <Suspense fallback={<SearchSkeleton />}>
            <SearchInterface />
          </Suspense>
        </SearchErrorBoundary>
      </div>
    </main>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-4 w-full animate-pulse">
      <div className="h-14 bg-muted rounded-full w-full" />
      <div className="flex gap-2 justify-center">
        <div className="h-10 w-24 bg-muted rounded-lg" />
        <div className="h-10 w-24 bg-muted rounded-lg" />
        <div className="h-10 w-24 bg-muted rounded-lg" />
      </div>
    </div>
  );
}