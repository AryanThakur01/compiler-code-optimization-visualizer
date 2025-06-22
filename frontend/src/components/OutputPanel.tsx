import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { CheckCircle, Clock, Copy, Terminal, TypeIcon } from 'lucide-react'
import { useState } from 'react'
import { Editor } from '@monaco-editor/react'
import RunningCodeSkeleton from './RunningCodeSkeleton'
import { defineMonacoThemes } from '@/constants'
import { LANGUAGE_CONFIG } from '@/constants'
import { useEffect, useRef } from 'react'

const OutputPanel = () => {
  const { output, error, isRunning, fontSize, theme, language, setFontSize } = useCodeEditorStore()

  const [isCopied, setIsCopied] = useState(false)
  const [visibleOutput, setVisibleOutput] = useState('')
  const fullOutputRef = useRef('')

  const hasContent = !!(error || output)

  useEffect(() => {
    if (!isRunning && (output || error)) {
      const fullText = error || output || ''
      fullOutputRef.current = fullText
      setVisibleOutput('') // Reset for new animation

      let index = 0
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setVisibleOutput((prev) => prev + fullText.charAt(index))
          index++
        } else {
          clearInterval(interval)
        }
      }, 15) // Adjust speed here

      return () => clearInterval(interval)
    }
  }, [isRunning, output, error])

  const handleCopy = async () => {
    if (!hasContent) return
    await navigator.clipboard.writeText(error || output || '')
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 5000)
  }

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24)
    setFontSize(size)
    localStorage.setItem('editor-font-size', size.toString())
  }

  return (
    <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">Output Console</h2>
            <p className="text-xs text-gray-500">See your code’s result here</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Font Size Slider */}
          <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
            <TypeIcon className="size-4 text-gray-400" />
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">{fontSize}</span>
            </div>
          </div>

          {hasContent && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-[#1e1e2e] 
              rounded-lg ring-1 ring-white/10 hover:ring-white/20 transition-all"
            >
              {isCopied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Output Area */}
      <div className="rounded-xl overflow-hidden ring-1 ring-white/[0.05] h-[600px]">
        {isRunning ? (
          <div className="h-full w-full bg-[#1e1e2e]/50 flex items-center justify-center rounded-xl">
            <RunningCodeSkeleton />
          </div>
        ) : error || output ? (
          <Editor
            // value={error || output}
            value={visibleOutput}
            theme={theme}
            defaultLanguage={LANGUAGE_CONFIG[language].monacoLanguage}
            options={{
              readOnly: true,
              fontSize,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontLigatures: true,
              lineHeight: 1.6,
              letterSpacing: 0.5,
              roundedSelection: true,
              renderWhitespace: 'selection',
              cursorStyle: 'block',
              lineNumbers: 'on',
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              minimap: { enabled: false },
            }}
            beforeMount={defineMonacoThemes}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-[#1e1e2e]/50 rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-center">Run your code to see the output here...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default OutputPanel
