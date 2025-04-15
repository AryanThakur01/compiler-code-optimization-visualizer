import EditorPanel from './EditorPanel'
import OutputPanel from './OutputPanel'

export default function CodeArea() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full p-4">
      <div className="w-full min-h-[400px] sm:min-h-[500px]">
        <EditorPanel />
      </div>
      <div className="w-full min-h-[400px] sm:min-h-[500px]">
        <OutputPanel />
      </div>
    </div>
  )
}
