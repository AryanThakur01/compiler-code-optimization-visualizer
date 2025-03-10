import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Terminal } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import LoadingButton from './ui/LoadingButton'

export default function CodeOptimizer() {
  const [inputCode, setInputCode] = useState('')
  const [optimizedCode, setOptimizedCode] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('C++')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInputCode('')
    setOptimizedCode('')
  }, [selectedLanguage])

  async function handleOptimize() {
    setLoading(true)

    const languageRoutes: { [key: string]: string } = {
      'C++': 'cpp',
      C: 'c',
      Java: 'java',
      Python: 'python',
    }

    const selectedRoute = languageRoutes[selectedLanguage]
    try {
      const response = await fetch(`http://localhost:5000/optimize/${selectedRoute}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode, language: selectedLanguage }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server Error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      setOptimizedCode(data.optimized_code || 'No optimizations found.')
    } catch (error) {
      console.error('Error optimizing code:', (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative bg-input flex flex-col lg:flex-row gap-5 p-4 min-h-[917px] w-full text-foreground pt-20 rounded-2xl">
      {/* Tabs for Small Screens */}
      <div className="block lg:hidden w-full">
        <Tabs defaultValue="input" className="w-full bg-sidebar-ring p-2 rounded-2xl">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="input">Paste Code</TabsTrigger>
            <TabsTrigger value="output">Optimized Code</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5 bg-sidebar rounded-lg shadow-2xl flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="size-5 text-primary" />
                <div className="flex items-center justify-between gap-5">
                  <h2 className="text-lg font-semibold">Paste Your Code</h2>
                  <div className="text-2xl">
                    <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
                      <SelectTrigger className="w-[120px] p-2 bg-card text-foreground border border-border rounded-lg shadow-2xl">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover text-foreground rounded-lg shadow-2xl">
                        {['C', 'C++', 'Java', 'Python'].map((lang) => (
                          <SelectItem key={lang} value={lang} className="hover:bg-muted p-2 rounded-md">
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex">
                <Textarea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Paste your code here . . . ."
                  className="flex-grow min-h-[609px] p-3 bg-background text-foreground border border-border rounded-lg resize-none font-mono"
                />
              </div>
              <LoadingButton
                loading={loading}
                onClick={handleOptimize}
                text="Optimize Code"
                className="mt-4 w-full bg-primary text-primary-foreground"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="output">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-5 bg-sidebar rounded-lg shadow-2xl flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="size-5 text-green-400" />
                <h2 className="text-lg font-semibold">Optimized Code</h2>
              </div>
              <div className="flex">
                <Textarea
                  value={optimizedCode}
                  readOnly
                  className="flex-grow min-h-[681px] p-3 bg-background text-foreground border border-border rounded-lg resize-none"
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
          className="flex-1 p-5 bg-sidebar text-card-foreground rounded-lg shadow-2xl flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="size-5 text-primary" />
            <div className="flex items-center justify-between gap-5">
              <h2 className="text-lg font-semibold">Paste Your Code</h2>
              <div className="text-2xl">
                <Select onValueChange={setSelectedLanguage} value={selectedLanguage}>
                  <SelectTrigger className="w-[120px] p-2 bg-secondary text-secondary-foreground border border-border rounded-lg shadow-2xl">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground rounded-lg shadow-2xl">
                    {['C', 'C++', 'Java', 'Python'].map((lang) => (
                      <SelectItem key={lang} value={lang} className="hover:bg-muted p-2 rounded-md">
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex">
            <Textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Paste your code here..."
              className="flex-grow min-h-[671px] p-3 bg-background text-foreground border border-border rounded-lg resize-none"
            />
          </div>
          <LoadingButton
            loading={loading}
            onClick={handleOptimize}
            text="Optimize Code"
            className="mt-4 w-full bg-primary text-primary-foreground"
          />
        </motion.div>

        {/* Right Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-5 bg-sidebar text-card-foreground rounded-lg shadow-2xl flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="size-5 text-green-400" />
            <h2 className="text-lg font-semibold">Optimized Code</h2>
          </div>
          <div className="flex">
            <Textarea
              value={optimizedCode}
              readOnly
              className="flex-grow min-h-[681px] p-3 bg-background text-foreground border border-border rounded-lg resize-none"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
