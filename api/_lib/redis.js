import { Redis } from '@upstash/redis';

// Upstash Redis from the Vercel Marketplace sets KV_REST_API_*;
// a database created directly on upstash.com uses UPSTASH_REDIS_REST_*.
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
