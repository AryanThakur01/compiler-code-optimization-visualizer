import { useState } from 'react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Terminal } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CodeOptimizer() {
  const [inputCode, setInputCode] = useState('')
  const [optimizedCode, setOptimizedCode] = useState('')

  function handleOptimize() {
    fetch('http://localhost:5000/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: inputCode }),
    })
      .then((response) => response.json())
      .then((data) => setOptimizedCode(data.optimized_code))
      .catch((error) => console.error('Error optimizing code:', error))
  }

  return (
    <div className="relative bg-card flex flex-col lg:flex-row gap-5 p-4 min-h-screen w-full text-white pt-20">
      {/* Tabs for Small Screens */}
      <div className="block lg:hidden w-full">
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="input">Paste Code</TabsTrigger>
            <TabsTrigger value="output">Optimized Code</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5 bg-gray-800 rounded-lg shadow-lg flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="size-5 text-blue-400" />
                <h2 className="text-lg font-semibold">Paste Your Code</h2>
              </div>
              <Textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Paste your code here..."
                className="flex-grow min-h-[300px] p-3 bg-gray-900 text-foreground border border-gray-700 rounded-lg resize-none"
              />
              <Button onClick={handleOptimize} className="mt-4 bg-blue-500 hover:bg-blue-600 w-full cursor-pointer">
                Optimize Code
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="output">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5 bg-gray-800 rounded-lg shadow-lg flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="size-5 text-green-400" />
                <h2 className="text-lg font-semibold">Optimized Code</h2>
              </div>
              <Textarea
                value={optimizedCode}
                readOnly
                className="flex-grow min-h-[300px] p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none"
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Side-by-side Layout for Large Screens */}
      <div className="hidden lg:flex flex-1 gap-5">
        {/* Left Terminal*/}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-5 bg-gray-800 rounded-lg shadow-lg flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="size-5 text-blue-400" />
            <h2 className="text-lg font-semibold">Paste Your Code</h2>
          </div>
          <Textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste your code here..."
            className="flex-grow min-h-[300px] p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none"
          />
          <Button onClick={handleOptimize} className="mt-4 bg-blue-500 hover:bg-blue-600 w-full">
            Optimize Code
          </Button>
        </motion.div>

        {/* Right Terminal*/}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-5 bg-gray-800 rounded-lg shadow-lg flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="size-5 text-green-400" />
            <h2 className="text-lg font-semibold">Optimized Code</h2>
          </div>
          <Textarea
            value={optimizedCode}
            readOnly
            className="flex-grow min-h-[300px] p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none"
          />
        </motion.div>
      </div>
    </div>
  )
}
