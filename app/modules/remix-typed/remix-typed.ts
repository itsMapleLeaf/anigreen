import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { json, redirect, useActionData, useLoaderData } from "remix"

export type MaybePromise<Value> = Value | PromiseLike<Value>

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [Key in string]: JsonValue }
  | JsonValue[]
  // undefined technically can't exist in json, but having it here makes things easier
  | undefined

export type TypedResponse<Data extends JsonValue> = Omit<Response, "json"> & {
  json(): Promise<Data>
}

// prettier-ignore
type LoaderFunctionTyped<Data extends JsonValue> = (args: DataFunctionArgs) =>
  MaybePromise<Data | TypedResponse<Data>>

type InferLoaderData<LoaderFunction> =
  LoaderFunction extends LoaderFunctionTyped<infer Data> ? Data : never

export function responseTyped(
  body?: BodyInit | null,
  init?: ResponseInit | number,
) {
  return new Response(
    body,
    typeof init === "number" ? { status: init } : init,
  ) as TypedResponse<JsonValue>
}

export function jsonTyped<Data extends JsonValue>(
  data: Data,
  init?: ResponseInit | number,
) {
  return json(JSON.stringify(data), init) as TypedResponse<Data>
}

export function redirectTyped(url: string, init?: ResponseInit | number) {
  return redirect(url, init) as TypedResponse<never>
}

export function useLoaderDataTyped<
  LoaderFunction extends LoaderFunctionTyped<JsonValue>,
>() {
  return useLoaderData<InferLoaderData<LoaderFunction>>()
}

export function useActionDataTyped<
  LoaderFunction extends LoaderFunctionTyped<JsonValue>,
>() {
  return useActionData<InferLoaderData<LoaderFunction>>()
}
