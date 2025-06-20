// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import rehypeMathjax from 'rehype-mathjax';
import remarkMath from 'remark-math';
import rehypeMermaid from 'rehype-mermaid';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://wermos.github.io',
  // base: '/blog-v3',

  markdown: {
    remarkPlugins: [remarkMath],
    // rehypePlugins: [rehypeMathjax, [rehypeMermaid, { strategy: 'img-svg', dark: true }]],
    rehypePlugins: [rehypeMathjax, rehypeMermaid],
    syntaxHighlight: false,
  },

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
