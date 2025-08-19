import { readFileSync } from 'fs';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkGemoji from 'remark-gemoji';
import remarkRehype from 'remark-rehype';
import rehypeMathjax from 'rehype-mathjax/browser';
import rehypeStringify from 'rehype-stringify';

import extractSections from './extract';

function stripFrontmatter(md: string): string {
  return md.replace(/^---\n[\s\S]*?\n---/, '');
}

function stripImports(md: string): string {
  // Remove lines starting with "import" optionally ending with semicolon
  return md.replace(/^import .*;?\n/gm, '');
}

function stripMD(md: string): string {
    return stripImports(stripFrontmatter(md));
}

// Load Markdown from file
const markdown = stripMD(readFileSync('./samples/sample.md', 'utf8'));

(async () => {
  const file = await unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkGemoji)
  .use(remarkRehype)
  .use(rehypeMathjax)
  .use(extractSections)
  .use(rehypeStringify)
  .process(markdown);

console.log('Sections extracted:', file.data.sections);
})();
