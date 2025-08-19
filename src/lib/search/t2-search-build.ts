// src/lib/search/t2-search-build.ts
import { getCollection, type CollectionEntry } from 'astro:content';
import { randomUUID } from 'crypto';

export type TagIndexDocument = {
  id: string;
  url: string;
  date: string;
  title: string;
  tags: string[];
};

/**
 * Build a simple index for tags and titles only.
 */
export async function buildTagTitleIndex(): Promise<TagIndexDocument[]> {
  const posts: CollectionEntry<'blog'>[] = await getCollection('blog');

  const filtered = posts.filter((p) => !p.data.draft);

  return filtered.map((post) => ({
    id: randomUUID(),
    url: `/blog/${post.id.replace(/\.mdx?$/, '').replace(/\.md$/, '')}`,
    date: post.data.date instanceof Date ? post.data.date.toISOString() : '',
    title: post.data.title ?? '',
    tags: post.data.tags ?? [],
  }));
}
