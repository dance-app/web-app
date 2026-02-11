import {
  BASE_URL,
  ERROR_MESSAGES,
  type ApiResponse,
  type ApiSuccess,
} from './shared.api';

interface ApiConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export async function apiCall<T, M = unknown>(
  endpoint: string,
  config: ApiConfig = {}
): Promise<ApiSuccess<T, M>> {
  const {
    method = 'GET',
    body,
    headers = {},
    credentials = 'include',
  } = config;

  if (endpoint.startsWith('http')) {
    throw new Error('apiCall expects a path, not an absolute URL');
  }
  if (!endpoint.startsWith('/')) {
    throw new Error('apiCall endpoint should start with a leading slash (/)');
  }

  const url = `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const requestConfig: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials,
  };

  if (body && method !== 'GET') {
    requestConfig.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestConfig);
  const payload: ApiResponse<T, M> = await response.json();

  if ('data' in payload) return payload;

  const codeKey =
    typeof payload.message === 'string'
      ? payload.message
      : payload.message?.[0];
  const friendly =
    (codeKey && ERROR_MESSAGES[codeKey]) ||
    (typeof payload.message === 'string'
      ? payload.message
      : payload.message?.[0]) ||
    `API call failed with status ${response.status}`;
  const err = new Error(friendly);
  if (codeKey) {
    (err as any).code = codeKey;
  }
  throw err;
}
