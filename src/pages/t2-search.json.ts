// src/pages/t2-search.json.ts
import type { APIRoute } from 'astro';
import { buildTagTitleIndex } from '@/lib/search/t2-search-build';

export const GET: APIRoute = async () => {
  const index = await buildTagTitleIndex();

  return new Response(JSON.stringify(index), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
