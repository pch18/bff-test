import { cloneDeepWith } from "lodash-es";

/* eslint-disable no-proto */
const pathGetterSymbol = Symbol("pathGetterSymbol");

/**
 * 通过 Proxy 通过任意链式调用获取 path
 * const p = createPathGetter()
 * const test = p.aaa.bb.ccc
 * isPathGetter(test) === true
 * readPathGetter(test) === ['aaa','bb','ccc]
 */
export const createPathGetter = () => {
  const path = [] as string[];
  const callChain: any = new Proxy(
    {},
    {
      get(_, key: string | typeof pathGetterSymbol) {
        if (key === pathGetterSymbol) {
          return path;
        }
        path.push(key);
        return callChain;
      },
    }
  );
  return callChain;
};

/**
 * 读取 PathGetter 的 path 信息，如果非 PathGetter 则返回空
 *  */
export const readPathGetter = (p: any) => {
  console.log(p);
  return p[pathGetterSymbol] as string[] | undefined;
};

/**
 * 将包含pathGetter的对象传入，做替换
 */
export const replacePathGetter = <T>(
  obj: T,
  replacer: (path: string[]) => any
): T => {
  return cloneDeepWith(obj, (o) => {
    const path = readPathGetter(o);
    if (path) {
      return replacer(path);
    }
  });
};
