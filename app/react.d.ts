import "react"
declare module "react" {
  export function createContext<T>(): Context<T | undefined>
  export function useDeferredValue<T>(value: T): T
  export function startTransition(scope: () => void): void
  export function useTransition(): [
    isPending: boolean,
    startTransition: (scope: () => void) => void,
  ]
}
