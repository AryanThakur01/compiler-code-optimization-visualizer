import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/snippets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/snippets"!</div>
}
