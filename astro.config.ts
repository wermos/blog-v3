import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

import expressiveCode from 'astro-expressive-code';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeMathjax from 'rehype-mathjax/browser';
import remarkEmoji from 'remark-emoji';
import remarkMath from 'remark-math';
import rehypeDocument from 'rehype-document';
import remarkGemoji from 'remark-gemoji';

import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

import mermaid from 'astro-mermaid';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://wermos.github.io/blog-v3/',
  base: 'blog-v3',
  // trailingSlash: 'always',
  output: 'static',
  integrations: [
    mermaid({
      theme: 'default', // Default light theme
      autoTheme: true   // Automatically switches based on data-theme
    }),
    expressiveCode({
      themes: ['one-dark-pro'],
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme="${theme.name.split('-')[1]}"]`,
      defaultProps: {
        wrap: true,
        collapseStyle: 'collapsible-auto',
        showLineNumbers: false,
        // overridesByLang: {
        //   'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh':
        //     {
        //       showLineNumbers: false,
        //     },
        // },
      },
      // styleOverrides: {
      //   codeFontSize: '0.75rem',
      //   borderColor: 'var(--border)',
      //   codeFontFamily: 'var(--font-mono)',
      //   codeBackground:
      //     'color-mix(in oklab, var(--secondary) 25%, transparent)',
      //   frames: {
      //     editorActiveTabForeground: 'var(--muted-foreground)',
      //     editorActiveTabBackground:
      //       'color-mix(in oklab, var(--secondary) 25%, transparent)',
      //     editorActiveTabIndicatorBottomColor: 'transparent',
      //     editorActiveTabIndicatorTopColor: 'transparent',
      //     editorTabBorderRadius: '0',
      //     editorTabBarBackground: 'transparent',
      //     editorTabBarBorderBottomColor: 'transparent',
      //     frameBoxShadowCssValue: 'none',
      //     terminalBackground:
      //       'color-mix(in oklab, var(--secondary) 25%, transparent)',
      //     terminalTitlebarBackground: 'transparent',
      //     terminalTitlebarBorderBottomColor: 'transparent',
      //     terminalTitlebarForeground: 'var(--muted-foreground)',
      //   },
      //   lineNumbers: {
      //     foreground: 'var(--muted-foreground)',
      //   },
      //   uiFontFamily: 'var(--font-sans)',
      // },
    }),
    mdx(),
    react(),
    sitemap(),
    icon(),
  ],
  vite: {
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
    ],
    remarkPlugins: [remarkMath, remarkEmoji, remarkGemoji],
  },
})
