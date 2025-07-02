/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'astro'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'prettier' // disables conflicting ESLint rules that Prettier handles
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      rules: {
        // Add any Astro-specific rules here
        // Example: disable unused vars because Astro includes frontmatter
        'no-unused-vars': 'off'
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // You can put stricter or relaxed TS rules here if needed
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.astro/',
    'src/components/ui/' // third-party components from shadcn/ui
  ]
}
