import { deferred } from "@remix-run/node"
import { useDeferred } from "@remix-run/react"
import type {
  InferLoaderData,
  JsonValue,
  LoaderFunctionTyped,
  ResponseTyped,
} from "remix-typed"

export function deferredTyped<T extends JsonValue>(data: {
  [K in keyof T]: T[K] | PromiseLike<T[K]>
}) {
  return deferred(data) as ResponseTyped<T>
}

export function useDeferredTyped<F extends LoaderFunctionTyped<JsonValue>>() {
  return useDeferred<InferLoaderData<F>>()
}
