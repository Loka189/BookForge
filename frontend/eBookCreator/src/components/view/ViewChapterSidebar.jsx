import React from 'react'
import { BookOpen, Check, ChevronLeft } from 'lucide-react'

const ViewChapterSidebar = ({
  book,
  isOpen,
  onClose,
  selectedChapterIndex,
  onChapterSelect
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden transition-all duration-300 animate-in fade-in"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl z-50 transform transition-all duration-500 ease-out flex flex-col border-r border-slate-700/50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0`}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/50 animate-pulse">
                <BookOpen className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Contents
                </h2>
                <p className="text-xs text-slate-400">
                  {book.chapters?.length || 0} chapters
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-700/50 transition-all duration-200 group"
            >
              <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Book Info */}
        <div className="px-6 py-5 border-b border-slate-700/50 bg-slate-800/30 flex-shrink-0">
          <h3 className="text-sm font-bold text-white truncate mb-1" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs text-slate-400">
            by {book.author || 'Unknown Author'}
          </p>
        </div>

        {/* Chapter List */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {book.chapters?.map((chapter, index) => {
            const isSelected = selectedChapterIndex === index
            return (
              <button
                key={index}
                onClick={() => {
                  onChapterSelect(index)
                  onClose()
                }}
                className={`group relative w-full text-left px-4 py-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl shadow-violet-500/30 scale-[1.02]'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg hover:scale-[1.01]'
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}

                <div className="relative flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isSelected
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'bg-slate-800 text-violet-400 group-hover:bg-slate-700 group-hover:text-violet-300'
                    }`}
                  >
                    {index + 1}
                  </div>

                  <span className={`flex-1 text-sm font-semibold line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {chapter.title || `Chapter ${index + 1}`}
                  </span>

                  {isSelected && (
                    <Check className="w-5 h-5 text-white flex-shrink-0 animate-in zoom-in duration-300" />
                  )}
                </div>

                {isSelected && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-white rounded-r-full shadow-lg"></div>
                )}
              </button>
            )
          })}

          {!book.chapters?.length && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <BookOpen className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-sm text-slate-500">No chapters available</p>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Chapter {selectedChapterIndex + 1} of {book.chapters?.length || 0}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <span className="text-emerald-400 font-semibold">Reading</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg shadow-violet-500/50"
              style={{ width: `${((selectedChapterIndex + 1) / (book.chapters?.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default ViewChapterSidebar
