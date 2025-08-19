import type { SearchDocument } from './types';
import { computeSections } from './extract';
import { randomUUID } from 'crypto';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkMath from 'remark-math';
import remarkEmoji from 'remark-emoji';
import remarkGemoji from 'remark-gemoji';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import type { Root } from 'hast';
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Remove MDX import/export statements from raw content
 */
function stripImports(md: string): string {
  return md.replace(/^import .*;?\n/gm, '').replace(/^export .*;?\n/gm, '');
}

/**
 * Process raw MDX/MD content into HAST + frontmatter
 */
async function parseMdxToHast(rawContent: string): Promise<{ tree: Root; frontmatter: Record<string, any> }> {
  const { content, data: frontmatter } = matter(rawContent);

  const processor = unified()
    .use(remarkParse)
    .use(remarkMdx) // safe for MDX, harmless for MD
    .use(remarkMath)
    .use(remarkGemoji)
    .use(remarkEmoji)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['nofollow', 'noreferrer', 'noopener'] })

  const tree = await processor.run(processor.parse(content));
  return { tree: tree as Root, frontmatter };
}

/**
 * Convert one post into SearchDocument[]
 */
async function postToDocuments(rawContent: string, url: string, date: string): Promise<SearchDocument[]> {
  const { tree } = await parseMdxToHast(rawContent);
  const sections = computeSections(tree);

  return sections.map((section, i) => ({
    id: randomUUID(),
    url: section.heading ? `${url}#${section.heading}` : url,
    heading: section.heading ?? undefined,
    headingLevel: section.headingLevel ?? undefined,
    text: section.text,
    date,
    order: i,
  }));
}

/**
 * Build full index for all blog posts
 */
export async function buildAllBlogDocuments(): Promise<SearchDocument[]> {
  const posts: CollectionEntry<'blog'>[] = await getCollection('blog');
  const filteredPosts = posts.filter((post) => !post.data.draft);

  const allDocs: SearchDocument[][] = await Promise.all(
    filteredPosts.map(async (post) => {
      const rawContent = stripImports(post.body ?? '');
      const slug = post.id.replace(/\.mdx?$/, '').replace(/\.md$/, '');
      const url = `/blog/${slug}`;
      const date = post.data.date instanceof Date ? post.data.date.toISOString() : '';

      return await postToDocuments(rawContent, url, date);
    })
  );

  return allDocs.flat();
}
