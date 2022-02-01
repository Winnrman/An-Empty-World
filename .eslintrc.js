module.exports = {
    root: true,
    env: {
      node: true,
    },
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:@typescript-eslint/recommended'
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      "project": ["tsconfig.json"]
    },
    rules: {
      'semi': ['off', 'always'],
      'no-empty-function': ["off"],
      '@typescript-eslint/no-explicit-any': ["off"],
      '@typescript-eslint/no-non-null-assertion': ["off"],
      '@typescript-eslint/no-floating-promises': ['error'],
    },
    ignorePatterns: [ "dist/*" ],
}