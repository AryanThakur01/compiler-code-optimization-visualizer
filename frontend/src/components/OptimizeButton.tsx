import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { motion } from 'framer-motion'
import { Loader2, Play } from 'lucide-react'

function OptimizeButton() {
  const { getCode, isOptimizing, setIsOptimizing, language, setOutput, setError, setOptimizedResult, executionResult } = useCodeEditorStore()

  const getRouteForLanguage = (lang: string) => {
    switch (lang) {
      case 'cpp':
        return 'cpp'
      case 'c':
        return 'c'
      case 'java':
        return 'java'
      case 'python':
        return 'python'
      default:
        return ''
    }
  }

  const handleOptimize = async () => {
    const code = getCode()
    const selectedRoute = getRouteForLanguage(language)

    if (!code || !selectedRoute) {
      setError('Invalid code or unsupported language selected.')
      return
    }
    setIsOptimizing(true)
    setOutput('Optimizing code...')

    try {
      const response = await fetch(`http://localhost:5000/optimize/${selectedRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (response.ok) {
        setOutput(data.optimized_code || 'Optimization successful, but no code returned.')
        setIsOptimizing(false)
      } else {
        setError(data.error || 'Failed to optimize code.')
      }
    } catch (error) {
      setError('Error optimizing code.')
      console.error('Optimization Error:', error)
    }
  }

  return (
    <motion.button
      onClick={handleOptimize}
      disabled={isOptimizing}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex items-center gap-2.5 px-5 py-2.5
                 disabled:cursor-not-allowed focus:outline-none"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-500 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />

      <div className="relative flex items-center gap-2.5">
        {isOptimizing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white/70" />
            <span className="text-sm font-medium text-white/90">Optimizing...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
            <span className="text-sm font-medium text-white/90 group-hover:text-white">Optimize Code</span>
          </>
        )}
      </div>
    </motion.button>
  )
}

export default OptimizeButton
