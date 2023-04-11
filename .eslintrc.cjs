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
  // 0屏蔽，1警报，2错误
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
    // 不可以在代码里使用console
    "no-console": [2, { allow: ["info", "warn", "error"] }],
    // 使用 ?? 代替 ||
    "@typescript-eslint/prefer-nullish-coalescing": 0,
    // 自动合并相同import路径的不同值
    "@typescript-eslint/no-duplicate-imports": 2,
  },
  root: true,
};
