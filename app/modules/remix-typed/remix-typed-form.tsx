import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react"
import type { FormProps } from "remix"
import { Form } from "remix"
import type { InferTypedActionData, TypedActionMap } from "./remix-typed-action"

type OnlyString<Type> = Type extends string ? Type : never

export type TypedFormProps<
  ActionMap extends TypedActionMap,
  ActionName extends OnlyString<keyof ActionMap>,
> = Omit<ComponentPropsWithoutRef<"form"> & FormProps, "action"> & {
  as?: ComponentType<ComponentPropsWithoutRef<"form"> & FormProps>
  action: ActionName
  data: InferTypedActionData<ActionMap[ActionName]>
  children: ReactNode
}

export function createTypedForm<ActionMap extends TypedActionMap>(
  route: string,
) {
  return function TypedForm<ActionName extends OnlyString<keyof ActionMap>>({
    as: FormComponent = Form,
    action,
    data,
    children,
    ...formProps
  }: TypedFormProps<ActionMap, ActionName>) {
    return (
      <FormComponent action={route} method="post" {...formProps}>
        <input type="hidden" name="actionName" value={action} />
        <input type="hidden" name="data" value={JSON.stringify(data)} />
        {children}
      </FormComponent>
    )
  }
}
