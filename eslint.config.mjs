// eslint.config.mjs
import js from '@eslint/js';
import * as astro from 'eslint-plugin-astro';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,

  // Astro files
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astro.parser,
      parserOptions: {
        extraFileExtensions: ['.astro'],
        ecmaVersion: 2020,
        sourceType: 'module',
        tsconfigRootDir: './',
      },
    },
    plugins: {
      astro,
    },
    processor: astro.processors.astro, // 👈 required for frontmatter parsing!
    rules: {
      ...astro.configs.recommended.rules,
    },
  },

  // TypeScript files ONLY
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        // Do NOT include `project: true` unless you need it
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },

  {
    ignores: ['.astro/**'],
  },

  // Optional: Prettier compatibility
  prettier,
];
