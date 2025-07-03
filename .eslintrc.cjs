/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        ecmaVersion: 2020,
        sourceType: 'module'
      },
      plugins: ['astro'],
      extends: ['plugin:astro/recommended', 'plugin:@typescript-eslint/recommended', 'eslint:recommended',],
      rules: {
        'no-unused-vars': 'off'
        // You can add Astro-specific rules here
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.astro/',
    'src/components/ui/'
  ]
}
