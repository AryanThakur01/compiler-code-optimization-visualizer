import { useState } from 'react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Terminal } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Numbering from './Numbering'

export default function CodeOptimizer() {
  const [inputCode, setInputCode] = useState('')
  const [optimizedCode, setOptimizedCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('C++')

  function handleOptimize() {
    const languageRoutes: { [key: string]: string } = {
      'C++': 'cpp',
      C: 'c',
      Java: 'java',
      Python: 'python',
    }

    const selectedRoute = languageRoutes[selectedLanguage]

    fetch(`http://localhost:5000/optimize/${selectedRoute}`, {
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
                <div className="flex items-center justify-between gap-5">
                  <h2 className="text-lg font-semibold">Paste Your Code</h2>
                  <div className="text-2xl">
                    <Select onValueChange={(value) => setSelectedLanguage(value)} value={selectedLanguage}>
                      <SelectTrigger className="w-[120px] p-2 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>

                      <SelectContent className="bg-gray-900 text-white rounded-lg shadow-lg">
                        <SelectItem value="C" className="hover:bg-gray-700 p-2 rounded-md">
                          C
                        </SelectItem>
                        <SelectItem value="C++" className="hover:bg-gray-700 p-2 rounded-md">
                          C++
                        </SelectItem>
                        <SelectItem value="Java" className="hover:bg-gray-700 p-2 rounded-md">
                          Java
                        </SelectItem>
                        <SelectItem value="Python" className="hover:bg-gray-700 p-2 rounded-md">
                          Python
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex">
                {/* Line numbering and Textarea */}
                <Numbering text={inputCode} />
                <Textarea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="flex-grow min-h-[300px] p-3 bg-gray-900 text-foreground border border-gray-700 rounded-lg resize-none"
                />
              </div>
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
              <div className="flex">
                {/* Line numbering and Textarea */}
                <Numbering text={optimizedCode} />
                <Textarea
                  value={optimizedCode}
                  readOnly
                  className="flex-grow min-h-[300px] p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none"
                  style={{
                    lineHeight: '2rem',
                  }}
                />
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Side-by-side Layout for Large Screens */}
      <div className="hidden lg:flex flex-1 gap-5">
        {/* Left Terminal */}
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
          <div className="flex">
            {/* Line numbering and Textarea */}
            <Numbering text={inputCode} />
            <Textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste your code here..."
              className="flex-grow min-h-[300px] p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none"
            />
          </div>
          <Button onClick={handleOptimize} className="mt-4 bg-blue-500 hover:bg-blue-600 w-full">
            Optimize Code
          </Button>
        </motion.div>

        {/* Right Terminal */}
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
          <div className="flex">
            {/* Line numbering and Textarea */}
            <Numbering text={optimizedCode} />
            <Textarea
              value={optimizedCode}
              readOnly
              className="flex-grow min-h-[300px] p-3 bg-gray-900 text-white border border-gray-700 rounded-lg resize-none"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
