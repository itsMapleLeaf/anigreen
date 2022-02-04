import { createTypedForm } from "./modules/remix-typed/remix-typed-form"
import type { actionMap } from "./routes/actions"

export const TypedForm = createTypedForm<typeof actionMap>("/actions")
