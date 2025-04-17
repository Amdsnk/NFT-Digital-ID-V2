import { useCallback } from 'react';
import { useToast } from './use-toast';

type ErrorHandlerOptions = {
  context?: string;
  fallbackMessage?: string;
  showToast?: boolean;
};

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback(
    (error: unknown, options: ErrorHandlerOptions = {}) => {
      const {
        context = 'Operation',
        fallbackMessage = 'An unexpected error occurred',
        showToast = true,
      } = options;

      let errorMessage = fallbackMessage;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      if (showToast) {
        toast({
          title: `${context} Failed`,
          description: errorMessage,
          variant: 'destructive',
        });
      }

      return errorMessage;
    },
    [toast]
  );

  return { handleError };
}