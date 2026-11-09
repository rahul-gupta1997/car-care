const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');
const sort = require('eslint-plugin-simple-import-sort');
const unused = require('eslint-plugin-unused-imports');
module.exports = defineConfig([
  expo,
  prettier,
  { ignores: ['dist/**', 'coverage/**', '.expo/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'simple-import-sort': sort, 'unused-imports': unused },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]);
