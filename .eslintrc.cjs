module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "airbnb",
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'linebreak-style': 0,
    'import/extensions': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'eqeqeq': 0,
  },
}
