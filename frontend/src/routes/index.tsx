import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-6 gap-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Left Section - Hero Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center md:text-left max-w-2xl px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Welcome to <span className="text-blue-400">Code Optimiser</span>
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-300">
          Paste your code, improve performance, and write cleaner, more efficient code in seconds.
        </p>
        <div className="flex flex-wrap justify-center md:justify-start mt-6 gap-4">
          <Link to="/CodeArea" className={cn(buttonVariants({ variant: 'default' }), 'w-36 md:w-40 text-base')}>
            Get Started 🚀
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 text-base">
            Learn More →
          </a>
        </div>
      </motion.div>

      {/* Right Section - Animated Code Editor Placeholder */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md md:max-w-lg h-[250px] md:h-[350px] bg-white/10 border border-gray-700 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Status Message - Optimizing Code */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-0 left-0 w-full bg-gray-800/80 text-gray-300 text-sm p-2 text-center rounded-t-xl"
        >
          Optimizing code...
        </motion.div>

        {/* Code Block */}
        <motion.pre
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute inset-0 p-5 pt-12 text-xs md:text-sm font-mono text-gray-300 whitespace-pre-wrap break-words"
        >
          <code>{`function optimizedCode() {\n  console.log("Code Optimized Successfully!");\n}`}</code>
        </motion.pre>
      </motion.div>
    </div>
  )
}
