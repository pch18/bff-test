import { cloneDeepWith } from "lodash-es";

const ChainGetterReadPathSymbol = Symbol("ChainGetterReadPathSymbol");
const ChainGetterReadCallFnSymbol = Symbol("ChainGetterReadCallFnSymbol");
type ChainGetterSymbol =
  | typeof ChainGetterReadPathSymbol
  | typeof ChainGetterReadCallFnSymbol;

/**
 * 通过 Proxy 通过任意链式调用获取 path
 * const p = createChainGetter()
 * const test = p.aaa.bb.ccc
 * readChainGetter(test) === ['aaa','bb','ccc]
 */
export const createChainGetter = (
  callFn?: (path: string[], ...args: any[]) => any
) => {
  const callFn1 = callFn ? callFn.bind(null, []) : {};
  return new Proxy(callFn1, {
    get(_, key: string | ChainGetterSymbol) {
      if (key === ChainGetterReadCallFnSymbol) {
        return callFn1;
      }
      if (key === ChainGetterReadPathSymbol) {
        return [];
      }

      const path = [key];
      const callFn2 = callFn ? callFn.bind(null, path) : {};
      const callChain: any = new Proxy(callFn2, {
        get(_, key: string | ChainGetterSymbol) {
          if (key === ChainGetterReadCallFnSymbol) {
            return callFn2;
          }
          if (key === ChainGetterReadPathSymbol) {
            return path;
          }
          path.push(key);
          return callChain;
        },
      });
      return callChain;
    },
  });
};

/**
 * 读取 ChainGetter 的 path 信息，如果非 ChainGetter 则返回 undefined
 *  */
export const readPathFromChainGetter = (p: any) => {
  return p[ChainGetterReadPathSymbol] as string[] | undefined;
};

/**
 * 读取 ChainGetter 的 callFn 信息，如果非 ChainGetter 则返回 undefined
 *  */
export const readCallFnFromChainGetter = (p: any) => {
  return p[ChainGetterReadCallFnSymbol];
};

/**
 * 将包含 ChainGetter 的对象传入，做替换
 */
export const replaceChainGetterFromObj = <T>(
  obj: T,
  replacer: (path: string[]) => any
): T => {
  return cloneDeepWith(obj, (o) => {
    const path = readPathFromChainGetter(o);
    if (path) {
      return replacer(path);
    }
  });
};

/**
 * 将包含 ChainGetter 的对象传入，找出所有 pathGttter 的路径，和原 obj 的路径
 */
export const findChainGetterFromObj = (input: any, basePath: string[] = []) => {
  const pathList = [] as Array<{ objPath: string[]; getterPath: string[] }>;
  const getterPath = readPathFromChainGetter(input);
  if (getterPath) {
    pathList.push({ objPath: basePath, getterPath });
  } else if (input instanceof Object) {
    for (const key in input) {
      pathList.push(...findChainGetterFromObj(input[key], [...basePath, key]));
    }
  }
  return pathList;
};
