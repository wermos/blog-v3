// src/utils/caption-processor.ts
import rehypeMathjax from 'rehype-mathjax/browser';
import rehypeStringify from 'rehype-stringify';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export async function processCaption(caption: string): Promise<string> {
  if (!caption) return ''
  
  const processor = unified()
    .use(remarkParse) // Parses markdown
    .use(remarkMath) // Identifies math syntax
    .use(remarkRehype) // Converts remark tree to rehype tree
    .use(rehypeMathjax) // Processes math in rehype tree
    .use(rehypeStringify) // Converts rehype tree to HTML string

  const result = await processor.process(caption)
  return String(result)
}
