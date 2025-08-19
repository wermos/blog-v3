import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import icon from 'astro-icon'
import mermaid from 'astro-mermaid'
import expressiveCode from 'astro-expressive-code'

import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

import remarkEmoji from 'remark-emoji'
import remarkGemoji from 'remark-gemoji'
import remarkMath from 'remark-math'

import rehypeExternalLinks from 'rehype-external-links'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeMathjax from 'rehype-mathjax/browser'

import tailwindcss from '@tailwindcss/vite'

import { extractHeadingHtml } from './src/lib/heading-html-extractor'

export default defineConfig({
  site: 'https://wermos.github.io/blog-v3/',
  base: '/blog-v3/',
  output: 'static',
  integrations: [mermaid({
    theme: 'default',
    autoTheme: true,
    mermaidConfig: {
      startOnLoad: false,
    }
  }), expressiveCode({
    themes: ['catppuccin-latte', 'catppuccin-frappe'],
    plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
    useDarkModeMediaQuery: false,
    themeCssSelector: (theme) => {
      const themeMap = {
        'catppuccin-latte': 'light',
        'catppuccin-frappe': 'dark'
      } as const
      
      const dataTheme = themeMap[theme.name as keyof typeof themeMap]
      return `[data-theme="${dataTheme}"]`
    },
    defaultProps: {
      wrap: true,
      collapseStyle: 'collapsible-auto',
      showLineNumbers: false,
    },
  }), mdx(), react(), sitemap(), icon()],
  vite: {
    // need to silence spurious error because of https://github.com/withastro/astro/issues/14030
    // @ts-expect-error
    plugins: [tailwindcss()],
  },
  server: {
    port: 1234,
    host: true,
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['nofollow', 'noreferrer', 'noopener'],
        },
      ],
      rehypeHeadingIds,
      rehypeMathjax,
      [
        rehypePrettyCode,
        {
          theme: {
            light: 'catppuccin-latte',
            dark: 'catppuccin-frappe',
          },
        },
      ],
      extractHeadingHtml,
    ],
    remarkPlugins: [remarkMath, remarkEmoji, remarkGemoji],
  },
})