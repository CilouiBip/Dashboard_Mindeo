import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: true,
      // Transform data before caching to ensure serializability
      select: (data: unknown) => {
        if (typeof data === 'object' && data !== null) {
          return JSON.parse(JSON.stringify(data));
        }
        return data;
      }
    }
  }
});