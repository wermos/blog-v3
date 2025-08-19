// src/pages/search.json.ts

import { buildAllBlogDocuments } from '@/lib/search/buildDocuments';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const blogDocs = await buildAllBlogDocuments();
  return new Response(JSON.stringify(blogDocs), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

