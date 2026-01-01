'use client';

import { useMutation } from '@tanstack/react-query';
import { apiCall } from '@/lib/api/client';
import { ERROR_MESSAGES } from '@/lib/api/shared.api';

export function useVerifyEmail({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await apiCall<{ message: string }>(
        '/auth/verify-email',
        {
          method: 'POST',
          body: { token },
          credentials: 'omit',
        }
      );
      return response.data;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error: Error) => {
      const code = (error as any)?.code as string | undefined;
      const friendly =
        (code && ERROR_MESSAGES[code]) ||
        error.message ||
        'Email verification failed.';
      onError?.(new Error(friendly));
    },
  });
}
