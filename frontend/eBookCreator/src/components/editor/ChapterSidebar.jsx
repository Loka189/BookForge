// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { ArrowLeft, Sparkles, Trash2, Plus, GripVertical } from 'lucide-react'
// import { DndContext, closestCenter } from '@dnd-kit/core'
// import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
// import { CSS } from '@dnd-kit/utilities'
// import Button from '../ui/Button'
// import toast from 'react-hot-toast'


// // Sortable Chapter Item Component
// const SortableItem = ({ chapter, index, selectedChapterIndex, onSelectChapter, onDeleteChapter, onGenerateChapterContent, isGenerating }) => {
//     const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter._id || `new-${index}` });

//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition,
//     };
//     return (
//         <div
//             ref={setNodeRef}
//             style={style}
//             {...attributes}
//             {...listeners}
//             className={`p-2 border border-gray-200 rounded-md bg-white shadow-sm flex items-center justify-between ${
//                 selectedChapterIndex === index ? 'ring-2 ring-indigo-500' : ''
//             }`}
//         >
//             <div className='flex items-center space-x-2'>
//                 <GripVertical className='w-4 h-4 text-gray-400' />
//                 <span className='text-sm font-medium text-gray-900'>{chapter.title}</span>
//             </div>
//             <div className='flex items-center space-x-2'>
//                 <Button
//                     variant='ghost'
//                     size='sm'
//                     onClick={() => onGenerateChapterContent(chapter)}
//                     disabled={isGenerating}
//                 >
//                     <Sparkles className='w-4 h-4 mr-1' />
//                     Generate
//                 </Button>
//                 <Button
//                     variant='ghost'
//                     size='sm'
//                     onClick={() => onDeleteChapter(chapter)}
//                 >
//                     <Trash2 className='w-4 h-4 mr-1' />
//                     Delete
//                 </Button>
//             </div>
//         </div>
//     );
// };





// const ChapterSidebar = ({
//     book,
//     selectedChapterIndex,
//     onSelectChapter,
//     onAddChapter,
//     onDeleteChapter,
//     onReorderChapters,
//     onGenerateChapterContent,
//     isGenerating
// }) => {
//     const navigate = useNavigate();

//     const chapterIds = book.chapters.map((chapter, index) => chapter._id || `new-${index}`);

//     const handleDragEnd = (event) => {
//         const { active, over } = event;
//         if (active.id !== over.id) {
//             const oldIndex = chapterIds.indexOf(active.id);
//             const newIndex = chapterIds.indexOf(over.id);
//             onReorderChapters(oldIndex, newIndex);
//         }
//     };
//     return (
//         <aside className='w-72 bg-white border-r border-gray-200 flex flex-col'>
//             <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
//                 <Button
//                     variant='ghost'
//                     size='sm'
//                     onClick={() => { navigate('/dashboard') }}
//                     className='flex items-center text-gray-700 hover:text-gray-900'
//                 >
//                     <ArrowLeft className='w-4 h-4 mr-2' />
//                     Back to Dashboard
//                 </Button>
//                 <h2
//                     className='text-lg font-semibold text-gray-900 truncate max-w-[10rem]'
//                     title={book.title}
//                 >
//                     {book.title}
//                 </h2>
//             </div>

//             <div className='flex-1 overflow-y-auto bg-gray-50'>
//                 <DndContext
//                     collisionDetection={closestCenter}
//                     onDragEnd={handleDragEnd}
//                 >
//                     <SortableContext
//                         items={chapterIds}
//                         strategy={verticalListSortingStrategy}
//                     >
//                         <div className='p-4 space-y-2'>
//                             {book.chapters.map((chapter, index) => (
//                                 <SortableItem
//                                     key={chapter._id || `new-${index}`}
//                                     chapter={chapter}
//                                     index={index}
//                                     selectedChapterIndex={selectedChapterIndex}
//                                     onSelectChapter={onSelectChapter}
//                                     onDeleteChapter={onDeleteChapter}
//                                     onGenerateChapterContent={onGenerateChapterContent}
//                                     isGenerating={isGenerating}
//                                 />
//                             ))}
//                         </div>
//                     </SortableContext>
//                 </DndContext>
//             </div>

//             <div className='p-4 border-t border-slate-200 bg-white'>
//                 <Button
//                     className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl'
//                     variant='secondary'
//                     onClick={onAddChapter}
//                     icon={Plus}
//                 >
//                     New Chapter
//                 </Button>
//             </div>
//         </aside>

//     )
// }

// export default ChapterSidebar

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Trash2, Plus, GripVertical, Loader2 } from 'lucide-react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Button from '../ui/Button'
import toast from 'react-hot-toast'

// Sortable Chapter Item Component
const SortableItem = ({ 
    chapter, 
    index, 
    selectedChapterIndex, 
    onSelectChapter, 
    onDeleteChapter, 
    onGenerateChapterContent, 
    onChapterChange,
    isGenerating 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
        id: chapter._id || `new-${index}` 
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const isSelected = selectedChapterIndex === index;
    const isCurrentlyGenerating = isGenerating === index;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative rounded-xl transition-all duration-200 ${
                isSelected 
                    ? 'bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300 shadow-md' 
                    : 'bg-white border border-gray-200 hover:border-violet-200 hover:shadow-sm'
            }`}
        >
            <div 
                className='flex items-center p-3 cursor-pointer'
                onClick={() => {
                    onSelectChapter(index);
                    setIsExpanded(!isExpanded);
                }}
            >
                {/* Drag Handle */}
                <div 
                    {...attributes} 
                    {...listeners}
                    className='mr-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 transition-colors'
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className={`w-4 h-4 ${isSelected ? 'text-violet-500' : 'text-gray-400'}`} />
                </div>

                {/* Chapter Number Badge */}
                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mr-3 ${
                    isSelected 
                        ? 'bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-violet-100 group-hover:text-violet-600'
                }`}>
                    {index + 1}
                </div>

                {/* Chapter Title */}
                <span className={`flex-1 text-sm font-semibold truncate ${
                    isSelected ? 'text-violet-900' : 'text-gray-900'
                }`}>
                    {chapter.title}
                </span>

                {/* Action Buttons - Always Visible on Hover */}
                <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onGenerateChapterContent(index);
                        }}
                        disabled={isCurrentlyGenerating}
                        className='p-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        title='Generate Content'
                    >
                        {isCurrentlyGenerating ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                            <Sparkles className='w-4 h-4' />
                        )}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChapter(index);
                        }}
                        className='p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200'
                        title='Delete Chapter'
                    >
                        <Trash2 className='w-4 h-4' />
                    </button>
                </div>
            </div>

            {/* Expandable Description Section */}
            {isExpanded && (
                <div className='px-3 pb-3 pt-1 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200'>
                    <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Description</div>
                    <textarea
                        value={chapter.description || ''}
                        onChange={(e) => {
                            e.stopPropagation();
                            onChapterChange({ target: { name: 'description', value: e.target.value } });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder='Add chapter description to guide AI generation...'
                        rows={3}
                        className='w-full text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 placeholder-gray-400 transition-all'
                    />
                </div>
            )}

            {/* Selection Indicator */}
            {isSelected && (
                <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-violet-500 to-purple-500 rounded-r-full'></div>
            )}
        </div>
    );
};

const ChapterSidebar = ({
    book,
    selectedChapterIndex,
    onSelectChapter,
    onAddChapter,
    onDeleteChapter,
    onReorderChapters,
    onGenerateChapterContent,
    onChapterChange,
    isGenerating
}) => {
    const navigate = useNavigate();

    const chapterIds = book.chapters.map((chapter, index) => chapter._id || `new-${index}`);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = chapterIds.indexOf(active.id);
            const newIndex = chapterIds.indexOf(over.id);
            onReorderChapters(oldIndex, newIndex);
        }
    };

    return (
        <aside className='w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col shadow-lg'>
            {/* Header */}
            <div className='p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm'>
                <button
                    onClick={() => navigate('/dashboard')}
                    className='flex items-center text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors duration-200 mb-3 group'
                >
                    <div className='p-1.5 rounded-lg group-hover:bg-violet-50 transition-colors duration-200'>
                        <ArrowLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200' />
                    </div>
                    <span className='ml-2'>Back to Dashboard</span>
                </button>
                
                <div className='flex items-center gap-3'>
                    <div className='flex-shrink-0 w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30'>
                        <span className='text-white text-lg font-bold'>
                            {book.title?.charAt(0)?.toUpperCase() || 'B'}
                        </span>
                    </div>
                    <div className='flex-1 min-w-0'>
                        <h2
                            className='text-base font-bold text-gray-900 truncate'
                            title={book.title}
                        >
                            {book.title}
                        </h2>
                        <p className='text-xs text-gray-500'>
                            {book.chapters.length} {book.chapters.length === 1 ? 'Chapter' : 'Chapters'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chapters List */}
            <div className='flex-1 overflow-y-auto'>
                <div className='p-4'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                            Chapters
                        </h3>
                        <div className='h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-3'></div>
                    </div>

                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={chapterIds}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className='space-y-2'>
                                {book.chapters.map((chapter, index) => (
                                    <SortableItem
                                        key={chapter._id || `new-${index}`}
                                        chapter={chapter}
                                        index={index}
                                        selectedChapterIndex={selectedChapterIndex}
                                        onSelectChapter={onSelectChapter}
                                        onDeleteChapter={onDeleteChapter}
                                        onGenerateChapterContent={onGenerateChapterContent}
                                        onChapterChange={onChapterChange}
                                        isGenerating={isGenerating}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {book.chapters.length === 0 && (
                        <div className='text-center py-12'>
                            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <Plus className='w-8 h-8 text-gray-400' />
                            </div>
                            <p className='text-sm text-gray-500 mb-2'>No chapters yet</p>
                            <p className='text-xs text-gray-400'>Click below to add your first chapter</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Chapter Button */}
            <div className='p-4 border-t border-gray-200 bg-white'>
                <button
                    onClick={onAddChapter}
                    className='group relative w-full flex items-center justify-center px-4 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200 overflow-hidden'
                >
                    <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    <Plus className='w-5 h-5 mr-2 relative z-10' />
                    <span className='relative z-10'>Add New Chapter</span>
                    {/* Shimmer effect */}
                    <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent' style={{ transform: 'skewX(-12deg)' }}></div>
                </button>
            </div>
        </aside>
    )
}

export default ChapterSidebar