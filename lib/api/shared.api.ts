export const delay = async (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://api-792f.onrender.com';

export interface ApiSuccess<T> {
  data: T;
  meta?: any;
  error: null;
}

export interface ApiError {
  code: number;
  message: string[] | string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

export const ERROR_MESSAGES: Record<string, string> = {
  'min-8-characters': 'Password must be at least 8 characters long',
  'email-already-exists': 'An account with this email already exists',
  'password-required-for-email-sign-up': 'Password is required to sign up',
  'invalid-refresh-token':
    'Your session is invalid or expired, please sign in again',
  'invalid-token': 'Invalid token',
  'account-not-found': 'Account not found',
  'email-already-verified': 'Email is already verified',
  'password-required-for-email-sign-in': 'Password is required to sign in',
  'social-login-required': 'Please sign in with your social provider',
  'invalid-credentials': 'Invalid email or password',
  'email-not-verified': 'Please verify your email before signing in',
  'forbidden-credentials': 'These credentials are not allowed',
  'invalid-or-expired-token': 'Invalid or expired token',
  'account-not-local': 'This account uses a different login method',
  'current-password-incorrect': 'Current password is incorrect',
  'user-not-found': 'User not found',
};
