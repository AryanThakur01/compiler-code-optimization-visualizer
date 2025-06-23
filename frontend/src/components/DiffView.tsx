import { DiffEditor, OnMount } from '@monaco-editor/react'
import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { defineMonacoThemes } from '@/constants'
import { LANGUAGE_CONFIG } from '@/constants'
import { useEffect, useRef, useState } from 'react'

const DiffView = () => {
  const { language, theme, fontSize, originalOutput, optimizedOutput } = useCodeEditorStore()

  const originalCode = originalOutput?.trim() || ''
  const optimizedCode = optimizedOutput?.trim() || ''
  const [isDifferent, setIsDifferent] = useState(true)
  const editorRef = useRef<any>(null)

  // Dynamically detect if code is different
  useEffect(() => {
    setIsDifferent(originalCode !== optimizedCode)
  }, [originalCode, optimizedCode])

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor

    // Custom diff styling
    const styleSheet = document.createElement('style')
    styleSheet.innerText = `
      .monaco-diff-editor .line-delete {
        background-color: rgba(255, 99, 71, 0.15) !important;
      }
      .monaco-diff-editor .line-insert {
        background-color: rgba(50, 205, 50, 0.15) !important;
      }
    `
    document.head.appendChild(styleSheet)
  }

  return (
    <div className="relative bg-[#12121a]/90 backdrop-blur-md rounded-xl border border-white/[0.08] ring-1 ring-white/[0.06] p-4 shadow-md">
      <h2 className="text-white text-lg font-semibold mb-4">Code Diff Viewer</h2>

      {isDifferent ? (
        <DiffEditor
          original={originalCode}
          modified={optimizedCode}
          theme={theme}
          language={LANGUAGE_CONFIG[language].monacoLanguage}
          beforeMount={defineMonacoThemes}
          onMount={handleMount}
          options={{
            renderSideBySide: true,
            fontSize,
            readOnly: true,
            automaticLayout: true,
            originalEditable: false,
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontLigatures: true,
            lineNumbers: 'on',
            renderIndicators: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            minimap: {
              enabled: false,
            },
            renderOverviewRuler: true,
            renderMarginRevertIcon: true,
            ignoreTrimWhitespace: false,
          }}
        />
      ) : (
        <div className="text-center text-gray-400 py-20">✅ Code is already optimized. No differences found.</div>
      )}
    </div>
  )
}

export default DiffView
