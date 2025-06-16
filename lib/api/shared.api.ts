export const delay = async (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://api-792f.onrender.com';

export type ApiResponse<T> = T | { message: string; statusCode: number };
