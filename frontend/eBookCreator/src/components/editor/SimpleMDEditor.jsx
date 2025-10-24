// import React from 'react'
// import { Type } from 'lucide-react'
// import MDEditor,{commands} from '@uiw/react-md-editor'
// const SimpleMDEditor = ({
//     value = '',
//     onChange = () => {},
//     options = {},
// }) => {
//   return (
//     <div data-color-mode="light" className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//     {/* {header} */}
//     <div className='bg-gray-50 px-4 py-2 border-b border-gray-200'>
//         <div className='flex items-center gap-2 text-sm text-gray-600'>
//             <Type className='w-4 h-4'/>
//             <span>Markdown Editor</span>
//         </div>
//     </div>
//     {/* Editor */}
//     <div className='p-0'>
//         <MDEditor
//             value={value}
//             onChange={onChange}
//             height={400}
//             preview='live'
//             commands={[
//                 commands.bold,
//                 commands.italic,
//                 commands.strikethrough,
//                 commands.hr,
//                 commands.title,
//                 commands.divider,
//                 commands.link,
//                 commands.code,
//                 commands.image,
//                 commands.unorderedListCommand,
//                 commands.orderedListCommand,
//                 commands.checkedListCommand
//             ]}
//             hideMenu={true}/>
//     </div>
      
//     </div>
//   )
// }

// export default SimpleMDEditor

import React from 'react'
import { Type, Sparkles } from 'lucide-react'
import MDEditor, { commands } from '@uiw/react-md-editor'

const SimpleMDEditor = ({
    value = '',
    onChange = () => {},
    options = {},
    height = 400,
    showHeader = true,
    headerTitle = 'Markdown Editor',
    className = ''
}) => {
    return (
        <div 
            data-color-mode="light" 
            className={`border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}
        >
            {/* Enhanced Header */}
            {showHeader && (
                <div className='bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 px-5 py-3 border-b border-violet-100'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30'>
                                <Type className='w-4 h-4 text-white' />
                            </div>
                            <div>
                                <span className='text-sm font-bold text-gray-900'>{headerTitle}</span>
                                <div className='flex items-center gap-1.5 mt-0.5'>
                                    <Sparkles className='w-3 h-3 text-violet-500' />
                                    <span className='text-xs text-gray-500'>Supports Markdown</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Stats Badge */}
                        <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-violet-200/50 shadow-sm'>
                            <span className='text-xs font-semibold text-gray-600'>
                                {value?.length || 0} chars
                            </span>
                            <span className='text-gray-300'>•</span>
                            <span className='text-xs font-semibold text-gray-600'>
                                {value?.split(/\s+/).filter(w => w).length || 0} words
                            </span>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Editor */}
            <div className='relative bg-white'>
                <MDEditor
                    value={value}
                    onChange={onChange}
                    height={height}
                    preview='live'
                    commands={[
                        commands.bold,
                        commands.italic,
                        commands.strikethrough,
                        commands.hr,
                        commands.heading,
                        commands.divider,
                        commands.link,
                        commands.quote,
                        commands.code,
                        commands.codeBlock,
                        commands.image,
                        commands.divider,
                        commands.unorderedListCommand,
                        commands.orderedListCommand,
                        commands.checkedListCommand,
                    ]}
                    extraCommands={[
                        commands.codeEdit,
                        commands.codeLive,
                        commands.codePreview,
                        commands.fullscreen,
                    ]}
                    {...options}
                />
            </div>
        </div>
    )
}

export default SimpleMDEditor
