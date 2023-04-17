import { Link } from "@remix-run/react"
import { Info } from "lucide-react"
import { route } from "routes-gen"

export function Footer() {
  return (
    <footer className="container text-sm opacity-75">
      <Link to={route("/about")} className="link">
        <Info aria-hidden className="inline align-middle s-4" />{" "}
        <span className="link-underline">About</span>
      </Link>
    </footer>
  )
}
