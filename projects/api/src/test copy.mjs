import { setInterval } from "timers";
import { Project } from "ts-morph";

// 创建一个TypeScript项目对象
const project = new Project();

const sourceFile = project.addSourceFileAtPath(
  "/Users/pch18/code/github/bff-test/projects/api/src/controller/msg/index.ts"
);

function findExportedFunctions(sourceFile) {
  const exportedFunctions = sourceFile.getExportedDeclarations();
  // .filter((declaration) => {
  //   return (
  //     declaration.getKindName() === "FunctionDeclaration" ||
  //     (declaration.getKindName() === "VariableDeclaration" &&
  //       declaration.getType().getText().includes("=>"))
  //   );
  // });

  return exportedFunctions;
}

console.log({ findExportedFunctions: findExportedFunctions(sourceFile) });

// // 获取项目中的所有源文件
// const sourceFiles = project.getSourceFiles();

// console.log(sourceFiles);

// // 1. 找到文件中所有的导出的函数（包括箭头函数），放入 allExportFunctionList
// const allExportFunctionList = sourceFiles.getExportedDeclarations();

// .filter((declaration) => declaration.getKindName() === "ArrowFunction");

// console.log("allExportFunctionList", { allExportFunctionList });

// // 2. 从allExportFunctionList中分析所有函数，判断函数的返回值最终是由哪一个方法创建的
// const getReturnExpression = (arrowFunction) => {
//   const returnStatement = arrowFunction
//     .getDescendantStatements()
//     .find((statement) => statement.getKindName() === "ReturnStatement");
//   return returnStatement?.getExpression();
// };

// // 3. 判断这个方法的定义，是否来自于"@bff-sdk/api"这个包
// const isFromBffSdkApi = (expression) => {
//   if (!expression) return false;
//   const callExpression =
//     expression.getDescendantOfKindOrThrow("CallExpression");
//   const importDeclaration = callExpression
//     .getExpression()
//     .getSymbol()
//     .getDeclarations()[0]
//     .getParentIfKind("ImportDeclaration");
//   return importDeclaration?.getModuleSpecifierValue() === "@bff-sdk/api";
// };

// // 4. 输出所有满足条件的函数名称
// allExportFunctionList.forEach((arrowFunction) => {
//   const returnExpression = getReturnExpression(arrowFunction);
//   if (isFromBffSdkApi(returnExpression)) {
//     console.log(arrowFunction.getName());
//   }
// });

setInterval(() => 0, 10000000000);
