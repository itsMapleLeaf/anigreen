import type { DataFunctionArgs } from "@remix-run/server-runtime"
import type { ZodType } from "zod"
import type { JsonValue } from "./remix-typed"
import { responseTyped } from "./remix-typed"

export type TypedAction<Data extends JsonValue> = {
  schema: ZodType<Data>
  run: (data: Data, args: DataFunctionArgs) => unknown
}

export type TypedActionMap = {
  [key: string]: TypedAction<any>
}

export type InferTypedActionData<Type> = Type extends TypedAction<infer Data>
  ? Data
  : never

export function defineTypedAction<Data extends JsonValue>(
  config: TypedAction<Data>,
) {
  return config
}

export function createActionHandler(actions: TypedActionMap) {
  return async function action(args: DataFunctionArgs) {
    const body = Object.fromEntries(await args.request.formData())
    const actionName = body.actionName as string

    const action = actions[actionName]
    if (!action) {
      throw new Error(`Unknown action ${actionName}`)
    }

    const data = action.schema.parse(JSON.parse(body.data as string))
    const result = await action.run(data, args)
    return result || responseTyped(undefined, 204) // 204 means "No Content"
  }
}
