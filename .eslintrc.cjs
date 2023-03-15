module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard-with-typescript", "prettier"],
  plugins: ["prettier"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": 2,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-misused-promises": 0,
  },
  root: true,
};
