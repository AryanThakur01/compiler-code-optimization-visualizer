import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { CheckCircle, Clock, Copy, Terminal, TypeIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import RunningCodeSkeleton from './RunningCodeSkeleton'
import { defineMonacoThemes } from '@/constants'
import { LANGUAGE_CONFIG } from '@/constants'

const OutputPanel = () => {
  const { output, error, isRunning, fontSize, theme, language, setFontSize, originalCode } = useCodeEditorStore()
  const [isCopied, setIsCopied] = useState(false)
  const [visibleOutput, setVisibleOutput] = useState<{ text: string; updated: boolean; updating: boolean }[]>([])

  const hasContent = !!(error || output)

  useEffect(() => {
    if (!isRunning && (output || error)) {
      const original = (originalCode || '').split('\n')
      const updated = (error || output || '').split('\n')
      setVisibleOutput(
        original.map((line) => ({
          text: line,
          updated: false,
          updating: false,
        }))
      )

      let lastUpdatedIndex = 0
      const interval = setInterval(() => {
        if (lastUpdatedIndex < original.length) {
          let newOutput = original.map((line, index) => {
            const isUpdated = index < lastUpdatedIndex && index < updated.length
            return {
              text: isUpdated ? updated[index] : line,
              updated: isUpdated,
              updating: index === lastUpdatedIndex,
            }
          })

          if (lastUpdatedIndex >= updated.length - 1 && lastUpdatedIndex <= original.length - 1) {
            newOutput = newOutput.map((line, index) => ({
              ...line,
              text: index < updated.length ? updated[index] : '',
              updated: index < lastUpdatedIndex,
              updating: index === lastUpdatedIndex,
            }))
          }

          setVisibleOutput(newOutput)
          lastUpdatedIndex++
        } else {
          setTimeout(() => {
            setVisibleOutput((update) => update.map((line) => ({ ...line, updating: false, updated: true })))
          }, 1000) // Delay to simulate final output update
          clearInterval(interval)
        }
      }, 500) // Delay to simulate output update

      return () => clearInterval(interval)
    }
  }, [isRunning, output, error, originalCode])

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

      <div className="rounded-xl overflow-hidden ring-1 ring-white/[0.05] h-[600px] relative">
        {isRunning ? (
          <div className="h-full w-full bg-[#1e1e2e]/50 flex items-center justify-center rounded-xl">
            <RunningCodeSkeleton />
          </div>
        ) : hasContent ? (
          <div className="relative h-full">
            <div className="relative z-10 h-full bg-transparent">
              {!visibleOutput.find((line) => !line.updated) ? (
                <Editor
                  value={visibleOutput.map((line) => line.text).join('\n')}
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
                <pre className="my-2">
                  {visibleOutput.map((line, index) => (
                    <div
                      key={index}
                      className={`px-2 mx-2 rounded-sm gap-8 flex items-start ${line.updated ? 'text-white font-bold' : 'text-gray-500 blur-[0.5px]'} ${
                        line.updating ? 'come-in-from-left bg-gradient-to-r from-green-600 to-blue-500 text-white/90' : ''
                      }`}
                    >
                      <span className="flex-shrink-0 w-4 text-right pr-2">{index + 1}</span>
                      <span className="flex-1 whitespace-pre-wrap break-words">{line.text}</span>
                    </div>
                  ))}
                </pre>
              )}
            </div>
          </div>
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
