import { createFileRoute } from '@tanstack/react-router'
import CodeArea from '@/components/code-area'

export const Route = createFileRoute('/CodeArea')({
  component: CodeArea,
})
