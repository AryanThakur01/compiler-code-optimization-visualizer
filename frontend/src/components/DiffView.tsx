import { DiffEditor } from '@monaco-editor/react'
import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { defineMonacoThemes } from '@/constants'
import { LANGUAGE_CONFIG } from '@/constants'

const DiffView = () => {
  const { language, theme, fontSize, originalOutput, optimizedOutput } = useCodeEditorStore()

  const originalCode = originalOutput || ''
  const optimizedCode = optimizedOutput || ''

  return (
    <DiffEditor
      original={originalCode}
      modified={optimizedCode}
      theme={theme}
      language={LANGUAGE_CONFIG[language].monacoLanguage}
      options={{
        renderSideBySide: true,
        fontSize,
        readOnly: true,
        automaticLayout: true,
        originalEditable: false,
        fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
        fontLigatures: true,
        lineNumbers: 'on',
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
        minimap: { enabled: false },
      }}
      beforeMount={defineMonacoThemes}
    />
  )
}

export default DiffView
