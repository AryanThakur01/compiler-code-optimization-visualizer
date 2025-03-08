import { Textarea } from '@/components/ui/textarea'

export const CodeArea = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Textarea
        placeholder="Paste your code here..."
        className="h-48 w-full px-4 py-3 text-sm font-mono bg-gray-900 text-white border border-gray-700 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
      />
    </div>
  )
}
