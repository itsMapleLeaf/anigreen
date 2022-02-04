import { createTypedForm } from "remix-typed"
import type { actionMap } from "./routes/actions"

export const TypedForm = createTypedForm<typeof actionMap>("/actions")
