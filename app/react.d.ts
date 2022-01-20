import "react"
declare module "react" {
  export function createContext<T>(): Context<T | undefined>
}
