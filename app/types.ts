export type MaybePromise<Value> = Value | Promise<Value>

// prettier-ignore
export type InferLoaderData<LoaderFunction> =
  LoaderFunction extends (...args: any[]) => MaybePromise<infer Result>
    ? Result extends Response ? never : Result
    : never
