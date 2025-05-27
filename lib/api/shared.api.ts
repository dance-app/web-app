import { authAtom } from '@/lib/atoms';
import { getDefaultStore } from 'jotai';

const store = getDefaultStore();

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://api-792f.onrender.com/';

export type ApiResponse<T> =
  | T
  | { message: string; error: 'Forbidden'; statusCode: number };

interface FetcherOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  mock?: () => any | Promise<any>;
  delay?: number;
}

export async function fetcher<T>(
  endpoint: string,
  { method = 'GET', body, mock, delay: customDelay }: FetcherOptions = {}
): Promise<ApiResponse<T>> {
  const auth = store.get(authAtom);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (auth.status === 'authenticated' && auth) {
    headers['Authorization'] = `Bearer ${auth}`;
  }

  if (mock) {
    await delay(customDelay ?? 500);
    return await mock();
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const jsonResponse = await response.json();

  if ('error' in jsonResponse) {
    throw new Error(jsonResponse.message);
  }
  return jsonResponse as T;
}
