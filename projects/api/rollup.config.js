import typescript from "rollup-plugin-typescript2";
import { parse } from "acorn";
import { simple } from "acorn-walk";
import resolve from "@rollup/plugin-node-resolve";
import { createFilter } from "@rollup/pluginutils";

export default {
  //   input: "src/controller/index.ts",
  input: "src/test.ts",
  output: {
    file: "dist/service.cjs",
    format: "cjs",
  },
  plugins: [
    // resolve(), // 添加这一行
    typescript(),
    // myPlugin(),
  ],
};

function myPlugin(options = {}) {
  const filter = createFilter(["src/controller/**"], ["node_modules/**"]);

  return {
    name: "my-plugin",
    transform(code, id) {
      if (!filter(id)) return null;

      try {
        console.log(code);
        const ast = parse(code, {
          sourceType: "module",
          ecmaVersion: 2020,
        });
        // console.log(ast);
      } catch {
        // console.log(id, filter(id), code);
      }

      //   simple(ast, {
      //     CallExpression(node) {
      //       if (
      //         node.callee.type === "MemberExpression" &&
      //         node.callee.property.name === "log" &&
      //         node.callee.object.name === "console"
      //       ) {
      //         magicString.overwrite(
      //           node.callee.start,
      //           node.callee.end,
      //           "customLog"
      //         );
      //       }
      //     },
      //   });

      return {
        code,
        map: null,
      };
    },
  };
}
