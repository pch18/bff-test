module.exports = {
  extends: ["plugin:react/recommended"],
  parserOptions: {
    project: ["./projects/web/tsconfig.json"],
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "react/display-name": 0,
  },
};
