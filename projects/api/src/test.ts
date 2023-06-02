import { Project, SyntaxKind, SymbolFlags, type ts, type Node } from "ts-morph";
// 创建一个 ts-morph 项目
const project = new Project();

setTimeout(() => 1, 2000000);
// 添加要分析的 TypeScript 文件
const file = project.addSourceFileAtPath(
  "/Users/pch18/code/github/bff-test/projects/api/src/controller/msg/index.ts"
);

(global as any).refresh = () => {
  (global as any).file = project.addSourceFileAtPath(
    "/Users/pch18/code/github/bff-test/projects/api/src/controller/msg/index.ts"
  );
};
(global as any).refresh();

const getFunctionNode = (node: Node<ts.Node>) => {
  if (node.isKind(SyntaxKind.FunctionDeclaration)) {
    const name = node.getName();
    return {
      funcName: node.getName(),
      funcNode: node,
      isNamedExported: name && node.isNamedExport(),
      removeNode: () => {
        node.remove();
      },
      replaceNodeWithText: (str: string) => {
        node.replaceWithText(str);
      },
    };
  }
  if (node.isKind(SyntaxKind.VariableStatement)) {
    const dec = node.getDeclarations()[0];
    const name = dec?.getName();
    const expr = dec?.getInitializer();
    if (expr?.isKind(SyntaxKind.ArrowFunction)) {
      return {
        funcName: name,
        funcNode: expr,
        isNamedExported: name && node.isExported(),
        removeNode: () => {
          node.remove();
        },
        replaceNodeWithText: (str: string) => {
          node.replaceWithText(str);
        },
      };
    }
  }
};

file.forEachChild((node) => {
  const funcInfo = getFunctionNode(node);
  if (funcInfo) {
    const {
      funcName,
      funcNode,
      isNamedExported,
      removeNode,
      replaceNodeWithText,
    } = funcInfo;
    // 如果不是导出函数则丢弃
    if (!funcName || !isNamedExported) {
      // removeNode();
      return;
    }

    // 形参用逗号连接的string
    const paramsStr = funcNode
      .getParameters()
      .map((p) => p.getName())
      .join(", ");

    // 获取func的返回值类型
    const funcReturnType = funcNode
      .getType()
      .getCallSignatures()[0]
      ?.getReturnType();

    // 如果是promise函数，才被需要，否则丢弃
    if (funcReturnType?.getSymbol()?.getName() !== "Promise") {
      // removeNode();
      return;
    }
    const promiseReturnType = funcReturnType.getTypeArguments()[0];
    // 如果是特殊类型返回，则使用对应的fetch
    if (promiseReturnType?.getSymbol()?.getName() === "BffStreamHandle") {
      replaceNodeWithText(
        `const ${funcName} = (${paramsStr}) => fetch_stream('${funcName}',[${paramsStr}]);`
      );
    } else {
      replaceNodeWithText(
        `const ${funcName} = (${paramsStr}) => fetch('${funcName}',[${paramsStr}]);`
      );
    }
  } else if (node.isKind(SyntaxKind.VariableStatement)) {
    // node.remove();
  }
});

console.dir(file.getFullText());

// pnpm rollup -c && node --inspect ../dist/service.cjs
