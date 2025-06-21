'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerifyEmailResponse } from '@/app/api/auth/verify-email/route';
import { Spinner } from '@/components/ui/spinner';

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

  const [isPending, setIsPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorMsg('Invalid or missing confirmation token.');
      return;
    }

    const confirmEmail = async () => {
      setIsPending(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          body: JSON.stringify({ token }),
          credentials: 'include',
        });
        const body = (await res.json()) as VerifyEmailResponse;
        if ('error' in body) {
          throw new Error(body.error.message);
        }

        setSuccessMsg(
          'Your email has been successfully confirmed! You can now sign in.'
        );
      } catch (err: any) {
        setErrorMsg(err.message || 'Something went wrong.');
      } finally {
        setIsPending(false);
      }
    };

    confirmEmail();
  }, [token]);

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
