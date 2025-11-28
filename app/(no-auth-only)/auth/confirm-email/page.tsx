'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useVerifyEmail } from '@/hooks/use-verify-email';

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ConfirmEmailPageContent />
    </Suspense>
  );
}

function ConfirmEmailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const hasTriggered = useRef(false);

  const [isPending, setIsPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const verifyEmail = useVerifyEmail({
    onSuccess: () =>
      setSuccessMsg(
        'Your email has been successfully confirmed! You can now sign in.'
      ),
    onError: (err) => setErrorMsg(err.message),
  });

  useEffect(() => {
    if (!token) {
      setErrorMsg('Invalid or missing confirmation token.');
      return;
    }

    if (hasTriggered.current) return;
    hasTriggered.current = true;

    const confirmEmail = async () => {
      setIsPending(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      try {
        await verifyEmail.mutateAsync(token);
      } finally {
        setIsPending(false);
      }
    };

    confirmEmail();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Confirm Email</CardTitle>
          <CardDescription className="text-center">
            {isPending
              ? 'Verifying your token...'
              : successMsg
                ? 'Confirmed!'
                : 'We’re confirming your email address now.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isPending && (
            <div className="text-center text-sm text-gray-600">
              Please wait…
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <>
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                {successMsg}
              </div>
              <div className="text-center">
                <Button
                  onClick={() => router.push('/auth/sign-in')}
                  className="mt-2 w-full"
                >
                  Go to Sign In
                </Button>
              </div>
            </>
          )}

          {errorMsg && (
            <div className="text-center">
              <Button
                onClick={() => router.push('/auth/sign-in')}
                className="mt-2 w-full"
              >
                Go back to Sign In
              </Button>
            </div>
          )}

          {!isPending && !successMsg && !errorMsg && (
            <div className="text-center text-sm text-gray-600">
              If this takes longer than a few seconds, please refresh the page.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
