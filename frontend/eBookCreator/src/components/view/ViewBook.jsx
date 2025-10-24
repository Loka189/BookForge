import React, { useState, useEffect } from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import ViewChapterSidebar from './ViewChapterSidebar'

const ViewBook = ({ book }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0)
  const [fontSize, setFontSize] = useState(18)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isSidebarOpen])

  const chapters = book.chapters || []
  const selectedChapter = chapters[selectedChapterIndex] || { title: 'No Chapter', content: '' }

  const formatContent = (content) => {
    if (!content) return null
    return content
      .split('\n\n')
      .filter((para) => para.trim() !== '')
      .map((para, index) => (
        <p
          key={index}
          className={`mb-6 leading-relaxed transition-all duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
        >
          {para}
        </p>
      ))
  }

  return (
    <div className={`relative min-h-screen transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-white via-slate-50 to-slate-100'
    }`}>
      <ViewChapterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        book={book}
        selectedChapterIndex={selectedChapterIndex}
        onChapterSelect={setSelectedChapterIndex}
      />

      <div className="lg:ml-80 min-h-screen">
        {/* Header */}
        <header className={`sticky top-0 z-20 transition-all duration-500 ${
          isDarkMode
            ? 'bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50'
            : 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50'
        } shadow-2xl`}>
          <div className="flex items-center justify-between px-4 sm:px-8 py-5">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`lg:hidden p-3 rounded-2xl transition-all duration-300 group ${isDarkMode ? 'hover:bg-slate-800 active:scale-95' : 'hover:bg-slate-100 active:scale-95'} flex-shrink-0`}
                aria-label="Open sidebar"
              >
                <Menu className={`w-6 h-6 transition-colors ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`} />
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold truncate bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                  {book.title || 'Untitled Book'}
                </h1>
                <p className={`text-sm mt-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  by {book.author || 'Unknown Author'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl transition-all duration-300 group ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} active:scale-95`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700 group-hover:rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Font size controls */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 font-bold active:scale-95 ${isDarkMode ? 'hover:bg-slate-700 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-700 hover:text-slate-900'}`}
                  aria-label="Decrease font size"
                >
                  A-
                </button>
                <span className={`text-sm font-semibold min-w-[3rem] text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {fontSize}px
                </span>
                <button
                  onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 font-bold active:scale-95 ${isDarkMode ? 'hover:bg-slate-700 text-slate-300 hover:text-white' : 'hover:bg-slate-200 text-slate-700 hover:text-slate-900'}`}
                  aria-label="Increase font size"
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Chapter Content */}
        <main className="px-4 sm:px-8 py-12 max-w-4xl mx-auto w-full">
          <div className={`mb-10 pb-8 border-b transition-colors duration-500 ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
            <h2 className={`text-3xl sm:text-4xl font-bold mb-3 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {selectedChapter.title}
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <span className={`px-4 py-1.5 rounded-full font-medium ${isDarkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
                Chapter {selectedChapterIndex + 1}
              </span>
              <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
                {selectedChapter.content?.split(' ').length || 0} words
              </span>
            </div>
          </div>

          <article className="prose prose-lg max-w-none">
            {formatContent(selectedChapter.content)}
          </article>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-slate-700/50">
            <button
              onClick={() => setSelectedChapterIndex(Math.max(0, selectedChapterIndex - 1))}
              disabled={selectedChapterIndex === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${selectedChapterIndex === 0 ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 active:scale-95'}`}
            >
              ← Previous
            </button>
            <button
              onClick={() => setSelectedChapterIndex(Math.min(chapters.length - 1, selectedChapterIndex + 1))}
              disabled={selectedChapterIndex === chapters.length - 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${selectedChapterIndex === chapters.length - 1 ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105 active:scale-95'}`}
            >
              Next →
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ViewBook
