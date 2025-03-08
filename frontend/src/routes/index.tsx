import { buttonVariants } from '@/components/ui/button'
import { VizualizationWrapper } from '@/components/vizualization-wrapper'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="h-[80vh] max-h-[50rem] p-8 grid md:grid-cols-2 items-center gap-8">
        <div className="w-full h-[80vh] md:h-full border bg-white/10 rounded-xl md:order-1"></div>
        <div className="text-6xl">
          <p>Welcome to the e-waste disposal app</p>
          <div className="flex mt-4 gap-4">
            <Link to="/auth" className={cn(buttonVariants({ variant: 'default' }), 'w-32')}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <VizualizationWrapper />
    </>
  )
}
