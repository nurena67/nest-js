module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier' // Mencegah konflik antara Prettier & ESLint
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
      'prettier/prettier': ['error', { singleQuote: true, semi: true }],
      '@typescript-eslint/no-unused-vars': 'warn',
      "@typescript-eslint/no-unsafe-call": "off"
    },
  };
  