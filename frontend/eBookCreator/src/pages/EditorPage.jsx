import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Sparkles, FileDown, Save, Menu, X, Edit, Notebook, ChevronDown, FileText, Loader2 } from 'lucide-react'
import { API_PATHS } from '../utils/apiPaths'
import axiosInstance from '../utils/axiosInstance'
import Dropdown, { DropdownItem } from '../components/ui/Dropdown'
import InputField from '../components/ui/InputField'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import SelectField from '../components/ui/SelectField'
import { use } from 'react'
import ChapterEditorTab from '../components/editor/ChapterEditorTab'

import ChapterSidebar from '../components/editor/ChapterSidebar'
import BookDetailsTab from '../components/editor/BookDetailsTab'
import { arrayMove } from '@dnd-kit/sortable'

const EditorPage = () => {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('editor') // 'editor' or 'preview'
  const fileInputRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // AI modal states
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiStyle, setAiStyle] = useState('Narrative')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOKS_BY_ID}/${bookId}`)
        setBook(response.data)
      } catch (error) {
        toast.error('Error fetching book')
        console.error('Error fetching book:', error)
        navigate('/dashboard')
      } finally {
        setIsLoading(false)
      }
    };
    fetchBook();
  }, [bookId, navigate]);

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value
    }))
  }

  const handleChapterChange = (e) => {
    const { name, value } = e.target;
    const updatedChapters = [...book.chapters];
    updatedChapters[selectedChapterIndex][name] = value;
    setBook((prevBook) => ({
      ...prevBook,
      chapters: updatedChapters
    }));
  };

  const handleAddChapter = () => {
    const newChapter = {
      title: `Chapter ${book.chapters.length + 1}`,
      content: ''
    };
    const updatedChapters = [...book.chapters, newChapter];
    setBook((prevBook) => ({
      ...prevBook,
      chapters: updatedChapters
    }));
    setSelectedChapterIndex(updatedChapters.length - 1);
  };

  const handleDeleteChapter = (index) => {
    if (book.chapters.length <= 1) {
      toast.error('Cannot delete the last chapter');
      return;
    }
    const updatedChapters = book.chapters.filter((_, i) => i !== index);
    setBook((prevBook) => ({
      ...prevBook,
      chapters: updatedChapters
    }));
    setSelectedChapterIndex((prevIndex) => (prevIndex >= index ? Math.max(0, prevIndex - 1) : prevIndex));
  };

  const handleReorderChapters = (fromIndex, toIndex) => {
    setBook((prev) => ({
      ...prev,
      chapters: arrayMove(prev.chapters, fromIndex, toIndex)
    }));
    setSelectedChapterIndex(toIndex);
  };

  const handleSaveChanges = async ({ bookToSave = book, showToast = true } = {}) => {
    setIsSaving(true);
    try {
      await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`, bookToSave);
      if (showToast) {
        toast.success('Changes saved successfully');
      }
    } catch (error) {
      toast.error('Error saving changes');
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('coverImage', file);
    setIsUploading(true);
    try {
      const response = await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_COVER}/${bookId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setBook(response.data);
      toast.success('Cover image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading cover image');
      console.error('Error uploading cover image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateOutline = async () => { 

  };

const handleGenerateChapterContent = async (index) => { 
  const chapter = book.chapters[index];
  
  if(!chapter || !chapter.title) {
    toast.error('Chapter title is required for content generation');
    return;
  }
  
  setIsGenerating(index);
  
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_CHAPTER_CONTENT, {
      chapterTitle: chapter.title,
      chapterDescription: chapter.description || '',
      writingStyle: aiStyle || 'Narrative'
    });
    
    const updatedChapters = [...book.chapters];
    updatedChapters[index].content = response.data.content;
    
    const updatedBook = { ...book, chapters: updatedChapters };
    
    setBook(updatedBook);
    toast.success('Chapter content generated successfully');
    
    await handleSaveChanges({ bookToSave: updatedBook, showToast: false });
    
  } catch (error) {
    toast.error('Error generating chapter content');
    console.error('Error generating chapter content:', error);
  } finally {
    setIsGenerating(false);
  }
};
  const handleExportPDF = async () => {
    toast.loading('Preparing PDF export...');
    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPORT.PDF}/${bookId}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `book_${bookId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('PDF export successful');
    } catch (error) {
      toast.error('Error exporting PDF');
      console.error('Error exporting PDF:', error);
    }
  };

  const handleExportDOCX = async () => {
    toast.loading('Preparing DOCX export...');
    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPORT.DOC}/${bookId}/docx`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `book_${bookId}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success('DOCX export successful');
    } catch (error) {
      toast.error('Error exporting DOCX');
      console.error('Error exporting DOCX:', error);
    }
  };

  if (isLoading && !book) {
    return (
      <div className='flex h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='relative'>
            <Loader2 className='w-12 h-12 text-violet-600 animate-spin' />
            <div className='absolute inset-0 bg-violet-400 blur-xl opacity-30 animate-pulse'></div>
          </div>
          <p className='text-gray-600 font-medium'>Loading your book...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='flex bg-gradient-to-br from-gray-50 to-slate-50 font-sans relative min-h-screen'>
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className='fixed inset-0 z-50 flex md:hidden' role='dialog' aria-modal='true'>
            <div 
              className='fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity'
              aria-hidden='true' 
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl'>
              <div className='absolute top-0 right-0 -mr-12 pt-4'>
                <button 
                  className='ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white'
                  type='button'
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className='sr-only'>Close sidebar</span>
                  <X className='h-6 w-6 text-white' />
                </button>
              </div>
              <ChapterSidebar
                book={book}
                selectedChapterIndex={selectedChapterIndex}
                onSelectChapter={(index) => {
                  setSelectedChapterIndex(index)
                  setIsSidebarOpen(false)
                }}
                onAddChapter={handleAddChapter}
                onDeleteChapter={handleDeleteChapter}
                onReorderChapters={handleReorderChapters}
                onGenerateChapterContent={handleGenerateChapterContent}
                isGenerating={isGenerating}
              />
            </div>
            <div className='flex-shrink-0 w-14' aria-hidden='true'></div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className='hidden md:flex md:flex-shrink-0'>
          <ChapterSidebar
            book={book}
            selectedChapterIndex={selectedChapterIndex}
            onSelectChapter={(index) => {
              setSelectedChapterIndex(index);
              setIsSidebarOpen(false);
            }}
            onAddChapter={handleAddChapter}
            onDeleteChapter={handleDeleteChapter}
            onReorderChapters={handleReorderChapters}
            onGenerateChapterContent={handleGenerateChapterContent}
            isGenerating={isGenerating}
          />
        </div>

        {/* Main Content */}
        <main className='flex-1 p-4 md:p-6 lg:p-8 bg-transparent min-h-screen'>
          {/* Enhanced Header */}
          <header className='mb-6 md:mb-8'>
            <div className='flex flex-col gap-3 md:gap-4'>
              {/* Top Row - Menu & Tabs */}
              <div className='flex items-center space-x-2 md:space-x-3'>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className='md:hidden flex-shrink-0 p-2.5 rounded-xl bg-white hover:bg-violet-50 border border-gray-200 hover:border-violet-200 transition-all duration-200 shadow-sm hover:shadow-md'
                >
                  <Menu className='w-5 h-5 text-gray-700' />
                </button>
                
                {/* Tab Switcher */}
                <div className='flex bg-white rounded-xl border border-gray-200 shadow-sm p-1 flex-1 md:flex-initial'>
                  <button 
                    className={`flex items-center justify-center flex-1 md:flex-initial px-3 md:px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      activeTab === 'editor' 
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('editor')}
                  >
                    <Edit className='w-4 h-4 md:mr-2' />
                    <span className='hidden sm:inline'>Editor</span>
                  </button>
                  <button 
                    className={`flex items-center justify-center flex-1 md:flex-initial px-3 md:px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      activeTab === 'details' 
                        ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    <Notebook className='w-4 h-4 md:mr-2' />
                    <span className='hidden sm:inline'>Details</span>
                  </button>
                </div>
              </div>

              {/* Bottom Row - Action Buttons */}
              <div className='flex items-center gap-2 md:gap-3 relative z-10'>
                {/* Export Dropdown */}
                <Dropdown 
                  trigger={
                    <button className='inline-flex items-center justify-center flex-1 md:flex-initial px-3 md:px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md'>
                      <FileDown className='w-4 h-4 md:mr-2' />
                      <span className='hidden sm:inline'>Export</span>
                      <ChevronDown className='w-4 h-4 ml-1 md:ml-2' />
                    </button>
                  }
                >
                  <DropdownItem onClick={handleExportPDF}>
                    <FileText className='w-4 h-4 mr-2' />
                    Export as PDF
                  </DropdownItem>
                  <DropdownItem onClick={handleExportDOCX}>
                    <FileText className='w-4 h-4 mr-2' />
                    Export as DOCX
                  </DropdownItem>
                </Dropdown>

                {/* Save Button */}
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className='relative inline-flex items-center justify-center flex-1 md:flex-initial px-4 md:px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  <span className='relative z-10 flex items-center gap-2'>
                    {isSaving ? (
                      <>
                        <Loader2 className='w-4 h-4 animate-spin' />
                        <span className='hidden sm:inline'>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className='w-4 h-4' />
                        <span className='hidden sm:inline'>Save Changes</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Content Area with Card */}
          <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
            {activeTab === 'editor' ? (
              <ChapterEditorTab
                book={book}
                selectedChapterIndex={selectedChapterIndex}
                onChapterChange={handleChapterChange}
                onGenerateChapterContent={handleGenerateChapterContent}
                isGenerating={isGenerating}
              />
            ) : (
              <BookDetailsTab
                book={book}
                onBookChange={handleBookChange}
                isUploading={isUploading}
                fileInputRef={fileInputRef}
                onCoverImageUpload={handleCoverImageUpload}
              />
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default EditorPage