import EditorPanel from './EditorPanel'
import OutputPanel from './OutputPanel'

export default function CodeArea() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <EditorPanel />
      <OutputPanel />
    </div>
  )
}
