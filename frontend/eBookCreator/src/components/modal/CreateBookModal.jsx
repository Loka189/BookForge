// import React, { useState, useRef, useEffect } from 'react'
// import { Plus, Sparkles, Trash, Hash, Palette, Lightbulb, BookOpen, ArrowLeft } from 'lucide-react'
// import Modal from '../ui/Modal'
// import InputField from '../ui/InputField'
// import SelectField from '../ui/SelectField'
// import Button from '../ui/Button'
// import toast from 'react-hot-toast'
// import { useAuth } from '../../context/AuthContext'
// import axios from 'axios'
// import axiosInstance from '../../utils/axiosInstance'
// import { API_PATHS } from '../../utils/apiPaths'
// //import { on } from '../../../../../backend/models/User'

// const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
//     const { user } = useAuth()
//     const [step, setStep] = useState(1)
//     const [bookTitle, setBookTitle] = useState('')
//     const [numberOfChapters, setNumberOfChapters] = useState(5)
//     const [aiTopic, setAiTopic] = useState('')
//     const [aiStyle, setAiStyle] = useState('Narrative')
//     const [chapters, setChapters] = useState([])
//     const [isGeneratingOutline, setIsGeneratingOutline] = useState(false)
//     const [isFinalizingBook, setIsFinalizingBook] = useState(false)
//     const chaptersContainerRef = useRef(null)

//     const resetModal = () => {
//         setStep(1)
//         setBookTitle('')
//         setNumberOfChapters(5)
//         setAiTopic('')
//         setAiStyle('Narrative')
//         setChapters([])
//         setIsGeneratingOutline(false)
//         setIsFinalizingBook(false)
//     }

//     const handleGenerateOutline = async () => { 
//         if (!bookTitle || !numberOfChapters){
//             toast.error('Please provide book title and number of chapters')
//             return;
//         }
//         setIsGeneratingOutline(true)
//         try {
//             const response= await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE,{
//                 topic:bookTitle,
//                 description: aiTopic || '',
//                 style: aiStyle,
//                 numChapters: numberOfChapters
//             })
//             setChapters(response.data.outline)
//             setStep(2)
//             toast.success('Outline generated successfully')
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Failed to generate outline')
//         } finally {
//             setIsGeneratingOutline(false)
//         }
//     }
//     const handleChapterChange = (index, field, value) => {
//         const updatedChapters = [...chapters]
//         updatedChapters[index] = { ...updatedChapters[index], [field]: value }
//         setChapters(updatedChapters)
//     }

//     const handleDeleteChapter = (index) => {
//         if (chapters.length <= 1) {
//             toast.error('At least one chapter is required')
//             return
//         }
//         setChapters(chapters.filter((_, i) => i !== index))
//     }

//     const handleAddChapter = () => {
//         setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, description: '' }])
//     }

//     const handleFinalizeBook = async () => {
//         if (!bookTitle || chapters.length === 0) {
//             toast.error('Book title and chapters are required')
//             return
//         }
//         setIsFinalizingBook(true)
//         try {
//             const response = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, {
//                 title: bookTitle,
//                 author: user.name || 'Unknown Author',
//                 chapters: chapters,
//             })
//             toast.success('eBook created successfully')
//             onBookCreated(response.data._id)
//             onClose()
//             resetModal()
//         } catch (error) {
//             console.log(error)
//             toast.error(error.response?.data?.message || 'Failed to create eBook')
//         } finally {
//             setIsFinalizingBook(false)
//         }
//      }

//     useEffect(() => {
//         if (step === 2 && chaptersContainerRef.current) {
//             const scrollableDiv = chaptersContainerRef.current
//             scrollableDiv.scrollTo({
//                 top: scrollableDiv.scrollHeight,
//                 behavior: 'smooth',
//             })
//         }
//     }, [chapters.length, step])

//     return (
//         <Modal
//             isOpen={isOpen}
//             onClose={() => {
//                 resetModal()
//                 onClose()
//             }}
//             title="Create New eBook"
//         >
//             {step === 1 && (
//                 <div className="space-y-6">
//                     {/* Progress indicator */}
//                     <div className="flex items-center justify-center space-x-4 mb-6">
//                         <div className="flex flex-col items-center">
//                             <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold shadow-md">
//                                 1
//                             </div>
//                             <p className="text-xs text-gray-600 mt-1">Details</p>
//                         </div>
//                         <div className="w-10 h-[2px] bg-violet-300"></div>
//                         <div className="flex flex-col items-center">
//                             <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-semibold shadow-inner">
//                                 2
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1">Outline</p>
//                         </div>
//                     </div>

//                     {/* Input Fields */}
//                     <div className="space-y-4">
//                         <InputField
//                             icon={BookOpen}
//                             label="Book Title"
//                             placeholder="Enter your eBook title"
//                             value={bookTitle}
//                             onChange={(e) => setBookTitle(e.target.value)}
//                         />
//                         <InputField
//                             icon={Hash}
//                             label="Number of Chapters"
//                             type="number"
//                             min={1}
//                             max={20}
//                             placeholder="Enter number of chapters"
//                             value={numberOfChapters}
//                             onChange={(e) => setNumberOfChapters(parseInt(e.target.value) || 1)}
//                         />
//                         <InputField
//                             icon={Lightbulb}
//                             label="AI Topic"
//                             placeholder="Enter the main topic for AI to generate content"
//                             value={aiTopic}
//                             onChange={(e) => setAiTopic(e.target.value)}
//                         />
//                         <SelectField
//                             icon={Palette}
//                             label="AI Style"
//                             options={['Narrative', 'Descriptive', 'Expository', 'Persuasive', 'Humorous', 'Satirical']}
//                             value={aiStyle}
//                             onChange={(e) => setAiStyle(e.target.value)}
//                         />
//                     </div>

//                     {/* Generate Button */}
//                     <div className="pt-4 text-center">
//                         <Button
//                             onClick={handleGenerateOutline}
//                             isLoading={isGeneratingOutline}
//                             icon={Sparkles}
//                             className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all duration-200"
//                         >
//                             Generate Outline with AI
//                         </Button>
//                     </div>
//                 </div>
//             )}
//             {step === 2 && (
//                 <div className="space-y-6">
//                     {/* Progress indicator */}
//                     <div className="flex items-center justify-center space-x-4 mb-4">
//                         <div className="flex flex-col items-center">
//                             <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold shadow-md">1</div>
//                             <p className="text-xs text-gray-600 mt-1">Details</p>
//                         </div>
//                         <div className="w-10 h-[2px] bg-violet-300"></div>
//                         <div className="flex flex-col items-center">
//                             <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold shadow-md">2</div>
//                             <p className="text-xs text-gray-600 mt-1">Outline</p>
//                         </div>
//                     </div>

//                     {/* Header */}
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <h3 className="text-lg font-semibold text-gray-900">Review Chapters</h3>
//                             <span className="text-sm text-gray-500">{chapters.length} chapters</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                             <Button
//                                 onClick={() => setStep(1)}
//                                 className="w-full max-w-[120px] bg-gray-100 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
//                                 variant="ghost"
//                                 icon={ArrowLeft}
//                             >
//                                 Back
//                             </Button>
//                             <Button
//                                 variant="secondary"
//                                 onClick={handleFinalizeBook}
//                                 isLoading={isFinalizingBook}
//                                 className="ml-2"
//                             >
//                                 Create eBook
//                             </Button>
//                         </div>
//                     </div>

//                     {/* Chapters list (scrollable) */}
//                     <div
//                         ref={chaptersContainerRef}
//                         className="space-y-4 max-h-64 overflow-auto pr-2"
//                     >
//                         {chapters.length === 0 ? (
//                             <div className="text-center py-8">
//                                 <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
//                                 <p className="mt-3 text-gray-500">No chapters generated yet. Add chapters to proceed.</p>
//                             </div>
//                         ) : (
//                             chapters.map((chapter, index) => (
//                                 <div
//                                     key={index}
//                                     className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
//                                 >
//                                     <div className="flex items-start justify-between">
//                                         <div className="flex items-center space-x-3">
//                                             <div className="w-8 h-8 rounded-md bg-violet-50 text-violet-600 flex items-center justify-center font-semibold">
//                                                 {index + 1}
//                                             </div>
//                                             <input
//                                                 type="text"
//                                                 value={chapter.title}
//                                                 onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
//                                                 placeholder="Chapter title"
//                                                 className="w-full text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent outline-none"
//                                             />
//                                         </div>

//                                         <button
//                                             onClick={() => handleDeleteChapter(index)}
//                                             title="Delete Chapter"
//                                             className="ml-4 p-2 rounded-md hover:bg-red-50 transition-colors"
//                                         >
//                                             <Trash className="w-4 h-4 text-red-600" />
//                                         </button>
//                                     </div>

//                                     <textarea
//                                         value={chapter.description}
//                                         onChange={(e) => handleChapterChange(index, 'description', e.target.value)}
//                                         placeholder="Chapter description"
//                                         rows={3}
//                                         className="mt-3 w-full resize-none rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-violet-300 focus:ring-1 focus:ring-violet-100"
//                                     />
//                                 </div>
//                             ))
//                         )}
//                     </div>

//                     {/* Add chapter button */}
//                     <div className="pt-2">
//                         <div className="flex justify-center">
//                             <button
//                                 type="button"
//                                 onClick={handleAddChapter}
//                                 className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-150"
//                             >
//                                 <Plus className="w-4 h-4 text-violet-600" />
//                                 <span className="text-sm font-medium text-gray-700">Add Chapter</span>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//         </Modal>
//     )
// }

// export default CreateBookModal

import React, { useState, useRef, useEffect } from 'react'
import { Plus, Sparkles, Trash, Hash, Palette, Lightbulb, BookOpen, ArrowLeft, Check, Loader2, GripVertical } from 'lucide-react'
import Modal from '../ui/Modal'
import InputField from '../ui/InputField'
import SelectField from '../ui/SelectField'
import Button from '../ui/Button'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
    const { user } = useAuth()
    const [step, setStep] = useState(1)
    const [bookTitle, setBookTitle] = useState('')
    const [numberOfChapters, setNumberOfChapters] = useState(5)
    const [aiTopic, setAiTopic] = useState('')
    const [aiStyle, setAiStyle] = useState('Narrative')
    const [chapters, setChapters] = useState([])
    const [isGeneratingOutline, setIsGeneratingOutline] = useState(false)
    const [isFinalizingBook, setIsFinalizingBook] = useState(false)
    const chaptersContainerRef = useRef(null)

    const resetModal = () => {
        setStep(1)
        setBookTitle('')
        setNumberOfChapters(5)
        setAiTopic('')
        setAiStyle('Narrative')
        setChapters([])
        setIsGeneratingOutline(false)
        setIsFinalizingBook(false)
    }

    const handleGenerateOutline = async () => { 
        if (!bookTitle || !numberOfChapters){
            toast.error('Please provide book title and number of chapters')
            return;
        }
        setIsGeneratingOutline(true)
        try {
            const response = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, {
                topic: bookTitle,
                description: aiTopic || '',
                style: aiStyle,
                numChapters: numberOfChapters
            })
            setChapters(response.data.outline)
            setStep(2)
            toast.success('Outline generated successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate outline')
        } finally {
            setIsGeneratingOutline(false)
        }
    }

    const handleChapterChange = (index, field, value) => {
        const updatedChapters = [...chapters]
        updatedChapters[index] = { ...updatedChapters[index], [field]: value }
        setChapters(updatedChapters)
    }

    const handleDeleteChapter = (index) => {
        if (chapters.length <= 1) {
            toast.error('At least one chapter is required')
            return
        }
        setChapters(chapters.filter((_, i) => i !== index))
    }

    const handleAddChapter = () => {
        setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, description: '' }])
    }

    const handleFinalizeBook = async () => {
        if (!bookTitle || chapters.length === 0) {
            toast.error('Book title and chapters are required')
            return
        }
        setIsFinalizingBook(true)
        try {
            const response = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, {
                title: bookTitle,
                author: user.name || 'Unknown Author',
                chapters: chapters,
            })
            toast.success('eBook created successfully')
            onBookCreated(response.data._id)
            onClose()
            resetModal()
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to create eBook')
        } finally {
            setIsFinalizingBook(false)
        }
    }

    useEffect(() => {
        if (step === 2 && chaptersContainerRef.current) {
            const scrollableDiv = chaptersContainerRef.current
            scrollableDiv.scrollTo({
                top: scrollableDiv.scrollHeight,
                behavior: 'smooth',
            })
        }
    }, [chapters.length, step])

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                resetModal()
                onClose()
            }}
            title="Create New eBook"
        >
            <div className="relative">
                {/* Enhanced Progress Indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center relative">
                            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                step >= 1 
                                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30' 
                                    : 'bg-gray-200 text-gray-500'
                            }`}>
                                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                                {step >= 1 && (
                                    <div className="absolute inset-0 bg-violet-400 rounded-xl blur-md opacity-40 animate-pulse"></div>
                                )}
                            </div>
                            <p className={`text-xs font-semibold mt-2 transition-colors duration-300 ${
                                step >= 1 ? 'text-violet-600' : 'text-gray-500'
                            }`}>
                                Details
                            </p>
                        </div>

                        {/* Connector */}
                        <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${
                            step >= 2 
                                ? 'bg-gradient-to-r from-violet-500 to-purple-500' 
                                : 'bg-gray-200'
                        }`}></div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center relative">
                            <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                step >= 2 
                                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30' 
                                    : 'bg-gray-200 text-gray-500'
                            }`}>
                                {step > 2 ? <Check className="w-5 h-5" /> : '2'}
                                {step >= 2 && (
                                    <div className="absolute inset-0 bg-violet-400 rounded-xl blur-md opacity-40 animate-pulse"></div>
                                )}
                            </div>
                            <p className={`text-xs font-semibold mt-2 transition-colors duration-300 ${
                                step >= 2 ? 'text-violet-600' : 'text-gray-500'
                            }`}>
                                Outline
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 1: Details */}
                {step === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right duration-300">
                        <InputField
                            icon={BookOpen}
                            label="Book Title"
                            placeholder="Enter your eBook title"
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                        />
                        <InputField
                            icon={Hash}
                            label="Number of Chapters"
                            type="number"
                            min={1}
                            max={20}
                            placeholder="Enter number of chapters"
                            value={numberOfChapters}
                            onChange={(e) => setNumberOfChapters(parseInt(e.target.value) || 1)}
                        />
                        <InputField
                            icon={Lightbulb}
                            label="AI Topic (Optional)"
                            placeholder="Describe what your book should be about"
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                        />
                        <SelectField
                            icon={Palette}
                            label="Writing Style"
                            options={['Narrative', 'Descriptive', 'Expository', 'Persuasive', 'Humorous', 'Satirical']}
                            value={aiStyle}
                            onChange={(e) => setAiStyle(e.target.value)}
                        />

                        {/* Enhanced Generate Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleGenerateOutline}
                                disabled={isGeneratingOutline || !bookTitle}
                                className="group relative w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-white bg-gradient-to-r from-violet-500 via-purple-600 to-violet-600 rounded-xl shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    {isGeneratingOutline ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Generating Outline...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Generate Outline with AI
                                        </>
                                    )}
                                </span>
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ transform: 'skewX(-12deg)' }}></div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Outline Review */}
                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Review Chapters</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-lg">
                                        {chapters.length} {chapters.length === 1 ? 'Chapter' : 'Chapters'}
                                    </span>
                                    <span className="text-sm text-gray-500">• Ready to customize</span>
                                </div>
                            </div>
                        </div>

                        {/* Chapters List (Scrollable) */}
                        <div
                            ref={chaptersContainerRef}
                            className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-gray-100"
                        >
                            {chapters.length === 0 ? (
                                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl">
                                    <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-violet-600" />
                                    </div>
                                    <p className="text-gray-600 font-medium">No chapters yet</p>
                                    <p className="text-sm text-gray-400 mt-1">Add chapters to get started</p>
                                </div>
                            ) : (
                                chapters.map((chapter, index) => (
                                    <div
                                        key={index}
                                        className="group relative border-2 border-gray-200 rounded-xl p-4 bg-white hover:border-violet-200 hover:shadow-md transition-all duration-200"
                                    >
                                        {/* Chapter Number Badge */}
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-500/30">
                                                {index + 1}
                                            </div>
                                            
                                            <div className="flex-1 space-y-3">
                                                {/* Title Input */}
                                                <input
                                                    type="text"
                                                    value={chapter.title}
                                                    onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                                                    placeholder="Chapter title"
                                                    className="w-full text-base font-bold text-gray-900 placeholder-gray-400 bg-transparent border-b-2 border-transparent hover:border-violet-200 focus:border-violet-400 focus:outline-none transition-colors pb-1"
                                                />

                                                {/* Description Textarea */}
                                                <textarea
                                                    value={chapter.description}
                                                    onChange={(e) => handleChapterChange(index, 'description', e.target.value)}
                                                    placeholder="Add a brief description of what this chapter will cover..."
                                                    rows={2}
                                                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all"
                                                />
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteChapter(index)}
                                                title="Delete Chapter"
                                                className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Add Chapter Button */}
                        <button
                            type="button"
                            onClick={handleAddChapter}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-violet-400 hover:bg-violet-50 transition-all duration-200 group"
                        >
                            <Plus className="w-5 h-5 text-violet-600 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-violet-600 transition-colors">
                                Add Another Chapter
                            </span>
                        </button>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                            
                            <button
                                onClick={handleFinalizeBook}
                                disabled={isFinalizingBook || chapters.length === 0}
                                className="group relative flex-1 flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    {isFinalizingBook ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creating eBook...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Create eBook
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default CreateBookModal