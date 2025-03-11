import { useCodeEditorStore, getExecutionResult } from '@/store/useCodeEditorStore'
import { motion } from 'framer-motion'
import { Loader2, Play } from 'lucide-react'

function RunButton() {
  const { runCode, isRunning } = useCodeEditorStore()

  const handleRun = async () => {
    await runCode()
    getExecutionResult()
  }

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative inline-flex items-center gap-2.5 px-5 py-2.5
                 disabled:cursor-not-allowed focus:outline-none"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl opacity-100 transition-opacity group-hover:opacity-90" />

      <div className="relative flex items-center gap-2.5">
        {isRunning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white/70" />
            <span className="text-sm font-medium text-white/90">Executing...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
            <span className="text-sm font-medium text-white/90 group-hover:text-white">Run Code</span>
          </>
        )}
      </div>
    </motion.button>
  )
}

export default RunButton
