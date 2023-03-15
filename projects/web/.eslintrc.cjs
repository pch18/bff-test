module.exports = {
  extends: ["plugin:react/recommended"],
  parserOptions: {
    project: ["./projects/web/tsconfig.json"],
  },
  plugins: ["react"],
  rules: {
    // 使用jsx时必须import React
    "react/react-in-jsx-scope": 0,
    // 组件比如有display名
    "react/display-name": 0,
    // 必须校验组件prop类型
    "react/prop-types": 0,
  },
};
