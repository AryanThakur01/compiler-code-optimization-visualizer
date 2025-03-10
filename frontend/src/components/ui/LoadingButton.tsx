import { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Define the button props with TypeScript
interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean
  text?: string
}

// Loading animation variants
const spinVariants = {
  initial: { rotate: 0, scale: 1 },
  animate: {
    rotate: 360,
    scale: [1, 1.2, 1], // Pulsating effect
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
  },
}

export default function LoadingButton({ loading, text = 'Submit', className, disabled, ...props }: LoadingButtonProps) {
  return (
    <button
      className={cn(
        'relative flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed',
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <motion.div
          variants={spinVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 flex items-center justify-center"
        >
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        </motion.div>
      ) : (
        <span className="transition-opacity">{text}</span>
      )}
    </button>
  )
}
