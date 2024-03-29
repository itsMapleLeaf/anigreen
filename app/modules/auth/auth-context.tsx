import { createContext, useContext } from "react"
import { raise } from "~/modules/common/errors"

export type AuthContextValue = {
  loggedIn: boolean
}

const Context = createContext<AuthContextValue>()

export const AuthProvider = Context.Provider

export const useAuthContext = () =>
  useContext(Context) ?? raise("AuthProvider not found")
