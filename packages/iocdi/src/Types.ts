export type Callback<T> = (...args: any[]) => T;
export type InferParameters<T> = T extends (...args: infer P) => any ? P : never;
export type InferParametersXFirstArg<T> = T extends (...args: [infer _A, ...infer P]) => any
  ? [...P]
  : never;

export type IsFunction<T> = T extends (...args: any[]) => infer R
  ? R extends (...args: any[]) => any
    ? InferParameters<R>
    : InferParametersXFirstArg<T>
  : never;

export type IsFunctionForReturnType<T> = T extends (...args: any[]) => infer R
  ? R extends (...args: any[]) => any
    ? ReturnType<R>
    : ReturnType<T>
  : never;
