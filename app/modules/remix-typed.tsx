import type { DataFunctionArgs } from "@remix-run/node"
import { deferred, json, redirect } from "@remix-run/node"
import {
  Deferred,
  useActionData,
  useDeferred,
  useFetcher,
  useLoaderData,
} from "@remix-run/react"
import type { ComponentPropsWithoutRef } from "react"

export type ResponseTyped<Data> = Omit<Response, "json"> & {
  json(): Promise<Data>
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue | undefined }
  | JsonValue[]

export function jsonTyped<Input extends JsonValue>(
  data: Input,
  init?: ResponseInit | number,
) {
  return json(data, init) as ResponseTyped<Input>
}

export type DeferredInput = {
  [key: string]: MaybePromise<JsonValue>
}

export type DeferredOutput<Input extends DeferredInput> = {
  [K in keyof Input]: PromiseToDeferred<Input[K]>
}

export type PromiseToDeferred<T> = T extends PromiseLike<infer U>
  ? DeferredValue<U>
  : T

export type DeferredValue<Value> = { __deferred: Value }

export function deferredTyped<Input extends DeferredInput>(data: Input) {
  return deferred(data) as ResponseTyped<DeferredOutput<Input>>
}

export function redirectTyped(url: string, init?: ResponseInit | number) {
  return redirect(url, init) as ResponseTyped<never>
}

export type DataFunctionTyped<
  Result extends JsonValue | DeferredOutput<DeferredInput>,
> = (args: DataFunctionArgs) => MaybePromise<ResponseTyped<Result>>

export type DefaultDataFunction = DataFunctionTyped<
  JsonValue | DeferredOutput<DeferredInput>
>

export function useLoaderDataTyped<DataFunction extends DefaultDataFunction>() {
  return useLoaderData<InferDataFunctionResult<DataFunction>>()
}

export function useActionDataTyped<DataFunction extends DefaultDataFunction>() {
  return useActionData<InferDataFunctionResult<DataFunction>>()
}

export function useFetcherTyped<DataFunction extends DefaultDataFunction>() {
  return useFetcher<InferDataFunctionResult<DataFunction>>()
}

export type InferDataFunctionResult<DataFunction> =
  DataFunction extends DataFunctionTyped<infer Data> ? Data : unknown

export type MaybePromise<Value> = Value | PromiseLike<Value>

export type DeferredProps = ComponentPropsWithoutRef<typeof Deferred>
export type DeferredTypedProps<Data> = Omit<
  DeferredProps,
  "data" | "children"
> & {
  data: Data | DeferredValue<Data>
  children: (data: Data) => React.ReactNode
}

export function DeferredTyped<Data>({
  children,
  ...props
}: DeferredTypedProps<Data>) {
  return (
    <Deferred {...props}>
      <DeferredConsumer>{children}</DeferredConsumer>
    </Deferred>
  )
}

function DeferredConsumer<Data>({
  children,
}: {
  children: (data: Data) => React.ReactNode
}) {
  const data = useDeferred<Data>()
  return <>{children(data)}</>
}
