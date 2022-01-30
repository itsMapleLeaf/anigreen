import "react-dom"
declare module "react-dom" {
  export function hydrateRoot(
    container: Element | Document,
    element: React.ReactElement,
  ): void
}
