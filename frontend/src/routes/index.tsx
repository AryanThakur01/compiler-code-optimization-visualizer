import ParticlesContainer from '@/components/ParticlesContainer'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center p-6 gap-8 bg-gradient-to-br from-background to-card text-foreground">
      <ParticlesContainer />
      {/* <ParticlesContainer /> */}
      {/* Left Section - Hero Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center md:text-left max-w-2xl px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
          Welcome to{' '}
          <motion.span
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-serif"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            Code Optimiser
          </motion.span>
        </h1>
        <p className="mt-4 text-base md:text-lg font-bold font-mono text-muted-foreground">
          Paste your code, improve performance, and write cleaner, more efficient code in seconds.
        </p>
        <div className="flex flex-wrap justify-center md:justify-start mt-6 gap-4">
          <Link to="/CodeArea" className={cn(buttonVariants({ variant: 'default' }), 'w-36 md:w-40 text-base')}>
            Get Started 🚀
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-all duration-300 text-base"
          >
            Learn More →
          </a>
        </div>
      </motion.div>

      {/* Right Section - Animated Code Editor Placeholder */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md md:max-w-lg h-[250px] md:h-[350px] bg-card border border-border rounded-xl shadow-lg overflow-hidden"
      >
        {/* Status Message - Optimizing Code */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-0 left-0 w-full bg-muted text-muted-foreground p-3 text-center rounded-t-xl"
        >
          {/* Optimizing Code Heading */}
          <motion.h3
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-xl font-semibold font-serif"
          >
            Optimizing Code . . . .
          </motion.h3>
          <Separator className="opacity-60" />
        </motion.div>

        {/* Code Block */}
        <motion.pre
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute inset-0 p-5 pt-16 text-xs md:text-sm font-mono whitespace-pre-wrap text-gray-400 break-words"
        >
          <code className="text-sm font-bold md:text-base font-mono text-muted-foreground p-2 rounded-lg">
            {`#include <iostream>\n void optimizedCode(){\n cout<<"Code Optimized Successfully!\\n";\n}\n int main(){\n optimizedCode();\n}`}
          </code>
        </motion.pre>
      </motion.div>
    </div>
  )
}
