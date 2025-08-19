// src/lib/search/extract.ts
import { visit } from 'unist-util-visit';
import type { Root, Element, Parent } from 'hast';
import GithubSlugger from 'github-slugger';

const slugger = new GithubSlugger();

/**
 * Remove MDX components (both real element nodes and literal JSX inside text/raw runs).
 * This is robust for multiline <Gallery ... /> blocks which are often left as text/raw nodes.
 */
function removeMDXComponents(tree: Root, components: string[]) {
  const names = components.join('|');

  const pairedRE = new RegExp(`<(${names})\\b[\\s\\S]*?<\\/\\1\\s*>`, 'g'); // <Gallery ...>...</Gallery>
  const selfClosingRE = new RegExp(`<(${names})\\b[^>]*?\\/\\s*>`, 'g'); // <Image ... />

  // (A) Collect element nodes to remove (don't mutate while visiting)
  const toRemove: { parent: Parent; index: number }[] = [];
  visit(tree, 'element', (node: Element, index: number | undefined, parent: Parent | undefined) => {
    if (!parent || typeof index !== 'number') return;
    if (node.tagName && components.includes(node.tagName)) {
      toRemove.push({ parent, index });
    }
  });
  // Remove in reverse order so indices remain valid
  for (let i = toRemove.length - 1; i >= 0; --i) {
    const { parent, index } = toRemove[i];
    parent.children.splice(index, 1);
  }

  // (B) Handle multiline JSX/raw runs: join contiguous text/raw nodes, remove matched blocks
  visit(tree, (node: any) => {
    if (!node || !node.children || !Array.isArray(node.children)) return;
    const children = node.children as any[];
    let i = 0;
    while (i < children.length) {
      const child = children[i];
      if (child && (child.type === 'text' || child.type === 'raw')) {
        // collect contiguous text/raw run
        let j = i;
        let combined = '';
        while (j < children.length && (children[j].type === 'text' || children[j].type === 'raw')) {
          combined += (typeof children[j].value === 'string' ? children[j].value : '') + '\n';
          j++;
        }

        const cleaned = combined.replace(pairedRE, '').replace(selfClosingRE, '');
        // Only modify the tree IF a component was actually removed.
        if (cleaned !== combined) {
          if (cleaned.trim().length === 0) {
            // The entire run was a component, so remove it completely.
            children.splice(i, j - i);
            // Loop continues without advancing i, as the next node is now at index i.
            continue;
          } else {
            // A component was removed, leaving some text.
            // Replace the original run with a single, cleaned text node.
            children.splice(i, j - i, { type: 'text', value: cleaned });
            i++;  // Advance past the newly inserted node.
            continue;
          }
        } else {
          // No component was found, so no changes were made.
          // Leave the original nodes as they are and just advance the loop counter.
          i = j;
          continue;
        }
      } else {
        i++;
      }
    }
  });
}

/**
 * Convert an array of HAST nodes to a plain text string while:
 * - Skipping fenced code blocks (<pre>)
 * - Preserving inline code (<code> not inside <pre>) as text, removing {:lang} markers
 * - Concatenating node-text with single spaces to avoid smushing words
 */
function hastNodesToPlainText(nodes: any[]): string {
  const parts: string[] = [];

  function nodeToText(node: any, parentTag?: string): string {
    if (!node) return '';
    if (node.type === 'text') return node.value ?? '';
    if (node.type === 'raw') return node.value ?? '';

    if (node.type === 'element') {
      const tag = node.tagName;

      // Skip fenced code blocks entirely
      if (tag === 'pre') return '';

      // Inline code: <code> not inside <pre>
      if (tag === 'code' && parentTag !== 'pre') {
        const inner = (node.children || [])
          .map((c: any) => (c.type === 'text' ? c.value : nodeToText(c, 'code')))
          .join('');
        return `${inner.replace(/\{\:[^}]+\}/g, '')}`;
      }

      if (Array.isArray(node.children)) {
        return node.children
          .map((c: any) => nodeToText(c, tag))
          .filter(Boolean)
          .join(' ');
      }
      return '';
    }
    return '';
  }

  for (const n of nodes) {
    const t = nodeToText(n, undefined).trim();
    if (t.length) parts.push(t);
  }

  return normalizeAndClean(parts.join(' '));
}

/**
 * Normalize and clean the final plain text:
 * - Remove display math blocks: \[...\], $$...$$, \begin{...}...\end{...}
 * - Keep inline math: turn \( ... \) -> ...
 * - Remove {:lang} markers (already removed in code handling but double-safe)
 * - Fix spacing: collapse whitespace, remove spaces before punctuation, fix parentheses spacing
 */
function normalizeAndClean(s: string): string {
  if (!s) return '';

  // Remove display math blocks
  s = s.replace(/\\\[[\s\S]*?\\\]/g, ' ');
  s = s.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  s = s.replace(/\\begin\{[^\}]+\}[\s\S]*?\\end\{[^\}]+\}/g, ' ');

  // Inline math
  s = s.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, inner) => inner.trim());

  // Fix parentheses spacing
  s = s.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');

  // Remove spaces before punctuation
  s = s.replace(/\s+([,.;:!?)])/g, '$1');

  // Collapse multiple spaces
  s = s.replace(/\s+/g, ' ').trim();

  // Remove LaTeX spacing commands
  s = s.replace(/\\[ ,!:\;\\]/g, ''); // removes \, \! \: \; \ 
  s = s.replace(/\\quad/g, ' ').replace(/\\qquad/g, ' ');

  return s;
}

/**
 * Check if element is a heading h2-h6 (ignore h1)
 */
function isHeading(node: Element): boolean {
  return Boolean(node.tagName && /^h[2-6]$/i.test(node.tagName));
}

function headingToText(node: Element): string {
  if (!node.children) return '';
  return node.children
    .map((child: any) => {
      if (child.type === 'text') return child.value ?? '';
      if (child.type === 'element' && child.tagName === 'code') {
        // Inline code: extract text + remove {:lang} markers
        const codeText = (child.children || [])
          .map((c: any) => (c.type === 'text' ? c.value : ''))
          .join('');
        return codeText.replace(/\{\:[^}]+\}/g, '');
      }
      // fallback for any other element
      if (child.type === 'element' && child.children) {
        return headingToText(child);
      }
      return '';
    })
    .join('')
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim();
}

/**
 * Compute sections from a HAST tree (pure function, reusable).
 */
export function computeSections(tree: Root): {
  heading: string | null;
  headingLevel: number | null;
  slug: string | null;
  text: string;
}[] {
  const mdxComponentsToRemove = ['Gallery', 'Image', 'Figure', 'Callout'];

  removeMDXComponents(tree, mdxComponentsToRemove);
  slugger.reset();

  const sections: {
    heading: string | null;
    headingLevel: number | null;
    slug: string | null;
    text: string;
  }[] = [];

  let currentHeading: string | null = null;
  let currentSlug: string | null = null;
  let currentHeadingLevel: number | null = null;
  let currentSectionNodes: any[] = [];

  const rootChildren = Array.isArray((tree as any).children) ? (tree as any).children : [];

  for (const child of rootChildren) {
    if (child && child.type === 'element' && isHeading(child as Element)) {
      // flush previous
      if (currentSectionNodes.length > 0) {
        const text = hastNodesToPlainText(currentSectionNodes);
        if (text.length > 0) {
          sections.push({
            heading: currentHeading,
            headingLevel: currentHeadingLevel,
            slug: currentSlug,
            text
          });
        }
      }

      currentHeading = headingToText(child as Element);
      currentHeadingLevel = parseInt((child as Element).tagName.replace('h', ''), 10);
      currentSlug = slugger.slug(currentHeading);

      currentSectionNodes = [];
    } else {
      currentSectionNodes.push(child);
    }
  }

  // flush final
  if (currentSectionNodes.length > 0) {
    const text = hastNodesToPlainText(currentSectionNodes);
    if (text.length > 0) {
      sections.push({
        heading: currentHeading,
        headingLevel: currentHeadingLevel,
        slug: currentSlug,
        text
      });
    }
  }

  return sections;
}

/**
 * Rehype plugin wrapper for Astro:
 * - Stores sections in Astro's frontmatter (or in file.data.sections if frontmatter not available)
 */
export default function extractSections() {
  return async function rehypePlugin(tree: Root, file: any) {
    const sections = computeSections(tree);

    if (file.data?.astro?.frontmatter) {
      file.data.astro.frontmatter.sections = sections; // ✅ Astro case
    } else {
      file.data.sections = sections; // ✅ fallback for tests / non-Astro usage
    }
  };
}
