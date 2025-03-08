import { useState } from 'react'
import { CodeArea } from './code-area'
import { VisualizationArea } from './visualization-area'

export const VizualizationWrapper = () => {
  const [codeArea, setCodeArea] = useState(true)
  return (
    <>
      {codeArea ? <CodeArea /> : <VisualizationArea />}
      <div className="flex i">
        <button
          onClick={() => {
            setCodeArea(!codeArea)
          }}
          className="p-2 bg-blue-400 "
        >
          {codeArea ? 'Visualise' : 'Reset'}
        </button>
      </div>
    </>
  )
}
