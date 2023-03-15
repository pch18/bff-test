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
    // 开启 prettier 报错
    "prettier/prettier": 2,
    // 函数必须明确定义返回类型
    "@typescript-eslint/explicit-function-return-type": 0,
    // 在返回 void 的函数中，返回 promise，常见于 fn:()=>void = async()=>{await xxx()}
    "@typescript-eslint/no-misused-promises": 0,
    // 禁止出现 callback / cb 的字样
    "n/no-callback-literal": 0,
    // 禁止定义后未使用的变量
    "@typescript-eslint/no-unused-vars": 1,
    // 强制将 !!x 转换成 Boolean(xx)
    "no-implicit-coercion": 2,
    // 不可以在条件判断中使用any类型
    "@typescript-eslint/strict-boolean-expressions": 0,
  },
  root: true,
};
