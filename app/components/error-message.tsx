export function ErrorMessage(props: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <main className="grid gap-3">
      {props.title != null && (
        <h1 className="font-condensed text-2xl">Something went wrong.</h1>
      )}
      {props.children}
      <a href="/" className="link justify-self-start">
        Return home
      </a>
    </main>
  )
}
