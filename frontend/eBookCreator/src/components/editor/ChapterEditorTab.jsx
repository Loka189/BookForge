import React from 'react'
import { useMemo, useState } from 'react'
import { Sparkles, Type, Eye, Maximize2, Minimize2, Edit3, Book, Loader2 } from 'lucide-react'
import SimpleMDEditor from './SimpleMDEditor'

const ChapterEditorTab = ({
    book = {
        title: 'Untitled',
        chapters: [
            {
                title: 'Chapter 1',
                content: ''
            }
        ]
    },
    selectedChapterIndex = 0,
    onChapterChange = () => { },
    onGenerateChapterContent = () => { },
    isGenerating
}) => {
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Simple markdown parser for preview
    const formatMarkdown = (text) => {
        if (!text) return '';

        let html = text
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 mt-6 mb-3">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-10 mb-5">$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-700">$1</em>')
            // Line breaks
            .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
            // Lists
            .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700">$1</li>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-gray-700">$1</li>');

        return `<p class="mb-4 text-gray-700 leading-relaxed">${html}</p>`;
    };

    if (selectedChapterIndex === null || !book.chapters[selectedChapterIndex]) {
        return (
            <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-12 min-h-[500px]">
                <div className="text-center">
                    <div className="relative inline-flex mb-6">
                        <div className="absolute inset-0 bg-violet-400 blur-2xl opacity-20 animate-pulse"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                            <Type className="w-10 h-10 text-violet-600" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Chapter Selected</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Choose a chapter from the sidebar to start editing or create a new one to begin writing
                    </p>
                </div>
            </div>
        )
    }

    const currentChapter = book.chapters[selectedChapterIndex];
    const isCurrentlyGenerating = isGenerating === selectedChapterIndex;

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'} transition-all duration-300`}>
            {/* Header */}
            <div className={`${isFullscreen ? 'p-4 md:p-6' : 'p-4 md:p-6'} border-b border-gray-200 bg-white`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
                    {/* Left Section - Title */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="hidden sm:flex w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
                            <Book className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                                Chapter Editor
                                <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-lg">
                                    {selectedChapterIndex + 1}
                                </span>
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5 truncate">
                                {currentChapter.title || `Chapter ${selectedChapterIndex + 1}`}
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Controls */}
                    <div className="flex items-center gap-2">
                        {/* AI Generate Button */}
                        <button
                            onClick={() => onGenerateChapterContent(selectedChapterIndex)}
                            disabled={isCurrentlyGenerating}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-sm font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-violet-200 hover:border-violet-300"
                        >
                            {isCurrentlyGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="hidden sm:inline">Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span className="hidden sm:inline">Generate with AI</span>
                                </>
                            )}
                        </button>

                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200">
                            <button
                                onClick={() => setIsPreviewMode(false)}
                                className={`flex items-center gap-2 px-2 md:px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${!isPreviewMode
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Edit3 className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                                onClick={() => setIsPreviewMode(true)}
                                className={`flex items-center gap-2 px-2 md:px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${isPreviewMode
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">Preview</span>
                            </button>
                        </div>

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 flex-shrink-0"
                            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-5 h-5" />
                            ) : (
                                <Maximize2 className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Chapter Title Input */}
                <div className="mt-4">
                    <input
                        type="text"
                        name="title"
                        value={currentChapter.title || ''}
                        onChange={onChapterChange}
                        placeholder="Chapter Title..."
                        className="w-full text-xl md:text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className={`${isFullscreen ? 'h-[calc(100vh-180px)]' : 'h-[calc(100vh-350px)] min-h-[400px] md:min-h-[500px]'} overflow-y-auto`}>
                {isPreviewMode ? (
                    /* Preview Mode */
                    <div className="max-w-4xl mx-auto p-4 md:p-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-12">
                            {/* Preview Header */}
                            <div className="mb-8 pb-6 border-b border-gray-200">
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                    {currentChapter.title || `Chapter ${selectedChapterIndex + 1}`}
                                </h1>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-lg font-medium">
                                        Chapter {selectedChapterIndex + 1}
                                    </span>
                                    <span>•</span>
                                    <span className="truncate">{book.title}</span>
                                </div>
                            </div>

                            {/* Preview Content */}
                            {currentChapter.content ? (
                                <div
                                    className="prose prose-sm md:prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: formatMarkdown(currentChapter.content) }}
                                />
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Type className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">No content yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Switch to edit mode to start writing</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Edit Mode - Using SimpleMDEditor */
                    <div className="h-full p-4 md:p-6">
                        <SimpleMDEditor
                            value={currentChapter.content || ''}
                            onChange={(value) => {
                                onChapterChange({ 
                                    target: { 
                                        name: 'content', 
                                        value: value 
                                    } 
                                })
                            }}
                            height={isFullscreen ? 'calc(100vh - 280px)' : 500}
                            headerTitle={`${currentChapter.title || `Chapter ${selectedChapterIndex + 1}`}`}
                            showHeader={true}
                            className="h-full"
                        />
                    </div>
                )}
            </div>

            {/* Footer Info */}
            {!isFullscreen && (
                <div className="px-4 md:px-6 py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-3 md:gap-4">
                        <span>{currentChapter.content?.length || 0} characters</span>
                        <span>•</span>
                        <span>~{Math.ceil((currentChapter.content?.split(/\s+/).length || 0) / 200)} min read</span>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-gray-400">Tip: Use markdown for formatting</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChapterEditorTab