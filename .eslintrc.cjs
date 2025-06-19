module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'astro'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Custom Astro rules
      },
    },
  ],
  ignorePatterns: ['.astro/'],
};
