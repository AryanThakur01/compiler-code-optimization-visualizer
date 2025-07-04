// import { Link } from '@tanstack/react-router'
// import { Home } from 'lucide-react'
// import ThemeSelector from './ThemeSelector'
// import LanguageSelector from './LanguageSelector'
// import RunButton from './RunButton'
// import OptimizeButton from './OptimizeButton'

// function Header() {
//   return (
//     <div className="relative z-10">
//       <div className="flex items-center lg:justify-between justify-center bg-[#0a0a0f]/80 backdrop-blur-xl p-4 mb-0 rounded-lg">
//         <div className="hidden lg:flex items-center gap-8">
//           <Link to="/" className="flex items-center gap-3 group relative">
//             {/* Hover Effect */}
//             <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
//             {/* Logo */}
//             <div
//               className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1
//               ring-white/10 group-hover:ring-white/20 transition-all"
//             >
//               <Home className="size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
//             </div>

//             <div className="flex flex-col">
//               <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
//                 CodeOptimizer
//               </span>
//             </div>
//           </Link>
//           {/* Navigation */}
//           {/* <nav className="flex items-center space-x-1"> */}
//           {/* <Link
//               to="/snippets"
//               className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50
//                 hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
//             >
//               <div
//                 className="absolute inset-0 bg-gradient-to-r from-blue-500/10
//                 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
//               />
//               <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
//             </Link> */}
//           {/* </nav> */}
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-3">
//             <ThemeSelector />
//             <LanguageSelector />
//           </div>
//           <RunButton />
//           <OptimizeButton />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Header

import { Link } from '@tanstack/react-router'
import { Home } from 'lucide-react'
import ThemeSelector from './ThemeSelector'
import LanguageSelector from './LanguageSelector'
import RunButton from './RunButton'
import OptimizeButton from './OptimizeButton'

function Header() {
  return (
    <div className="relative z-10 w-full">
      <div className="flex flex-wrap items-center justify-between bg-[#0a0a0f]/80 backdrop-blur-xl p-4 rounded-lg">
        {/* Left Section: Logo (Hidden on md & sm screens) */}
        <Link to="/" className="hidden lg:flex items-center gap-3 group relative">
          {/* Hover Effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
          {/* Logo */}
          <div
            className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1
            ring-white/10 group-hover:ring-white/20 transition-all"
          >
            <Home className="size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
          </div>

          <div className="flex flex-col">
            <span className="block text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
              CodeOptimizer
            </span>
          </div>
        </Link>

        {/* Right Section: Buttons (Flex-wrap for responsiveness) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 lg:mt-0">
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <LanguageSelector />
          </div>
          <RunButton />
          <OptimizeButton />
        </div>
      </div>
    </div>
  )
}

export default Header
