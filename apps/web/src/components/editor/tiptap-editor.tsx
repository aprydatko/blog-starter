'use client'

import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Mention from '@tiptap/extension-mention'
import { common, createLowlight } from 'lowlight'
import { Node, Mark, mergeAttributes } from '@tiptap/core'
import { UiState } from './extensions/ui-state-extension'
import { NodeBackground } from './extensions/node-background-extension'
import { DragContextMenu } from './drag-context-menu'

import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Table as TableIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    CheckSquare,
    Highlighter,
    Type,
    ChevronRight,
    Youtube,
} from 'lucide-react'
import { Button } from '@blog-starter/ui/button'
import { useCallback, useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@blog-starter/ui/dropdown-menu'

// Create lowlight instance
const lowlight = createLowlight(common)

// Custom FontSize Extension
const FontSize = Mark.create({
    name: 'fontSize',
    addGlobalAttributes() {
        return [
            {
                types: ['textStyle'],
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => {
                            const fontSize = element.style.fontSize
                            if (!fontSize) return null
                            return fontSize.replace('px', '')
                        },
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {}
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}px`,
                            }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run()
            },
            unsetFontSize: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run()
            },
        }
    },
})

// Custom YouTube Node
const YoutubeNode = Node.create({
    name: 'youtube',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            src: {
                default: null,
            },
            width: {
                default: 640,
            },
            height: {
                default: 360,
            },
        }
    },
    parseHTML() {
        return [
            {
                tag: 'div[data-youtube-video]',
                getAttrs: (node) => {
                    if (typeof node === 'string') return false
                    const div = node as HTMLElement
                    const iframe = div.querySelector('iframe')
                    return {
                        src: iframe?.getAttribute('src') || '',
                        width: iframe?.getAttribute('width') || 640,
                        height: iframe?.getAttribute('height') || 360,
                    }
                },
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        const videoId = this.extractVideoId(HTMLAttributes.src)
        if (!videoId) {
            return ['div', { 'data-youtube-video': true }, ['p', 'Invalid YouTube URL']]
        }
        const embedUrl = `https://www.youtube.com/embed/${videoId}`
        return [
            'div',
            { 'data-youtube-video': true, class: 'youtube-embed-wrapper my-4' },
            [
                'iframe',
                {
                    src: embedUrl,
                    width: HTMLAttributes.width,
                    height: HTMLAttributes.height,
                    frameborder: '0',
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                    allowfullscreen: 'true',
                    class: 'w-full rounded-lg',
                },
            ],
        ]
    },
    addCommands() {
        return {
            setYoutubeVideo: (options: { src: string; width?: number; height?: number }) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                })
            },
        }
    },
    addPasteRules() {
        return [
            {
                find: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g,
                handler: ({ state, range, match }) => {
                    const videoId = match[1]
                    const { tr } = state
                    const start = range.from
                    const end = range.to
                    tr.replaceWith(
                        start,
                        end,
                        this.type.create({
                            src: `https://www.youtube.com/watch?v=${videoId}`,
                            width: 640,
                            height: 360,
                        })
                    )
                },
            },
        ]
    },
    extractVideoId(url: string): string | null {
        if (!url) return null
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return match && match[2].length === 11 ? match[2] : null
    },
})

// Custom Details Node
const Details = Node.create({
    name: 'details',
    group: 'block',
    content: 'summary block*',
    defining: true,
    isolating: true,

    parseHTML() {
        return [
            {
                tag: 'details',
            },
        ]
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
        return ['details', mergeAttributes(HTMLAttributes), 0]
    },
})

// Custom Summary Node
const Summary = Node.create({
    name: 'summary',
    group: 'block',
    content: 'text*',
    defining: true,
    parseHTML() {
        return [
            {
                tag: 'summary',
            },
        ]
    },
    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
        return ['summary', mergeAttributes(HTMLAttributes), 0]
    },
})


interface TiptapEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null
    }

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const uploadImage = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file')
            return
        }

        try {
            const formData = new FormData()
            formData.append('file', file)
            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData
            })
            const data = await response.json()
            if (data.success) {
                editor.chain().focus().setImage({ src: data.url }).run()
            }
        } catch (error) {
            console.error('Failed to upload', error)
        }
    }, [editor])

    const addImage = useCallback(() => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                await uploadImage(file)
            }
        }
        input.click()
    }, [uploadImage])

    const insertDetails = useCallback(() => {
        editor.chain().focus().insertContent('<details><summary>Summary</summary><p>Content</p></details>').run()
    }, [editor])

    const insertYoutube = useCallback(() => {
        const url = window.prompt('Enter YouTube URL')
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }
    }, [editor])

    const fontSizes = [
        { label: '8px', value: '8' },
        { label: '10px', value: '10' },
        { label: '12px', value: '12' },
        { label: '14px', value: '14' },
        { label: '16px', value: '16' },
        { label: '18px', value: '18' },
        { label: '20px', value: '20' },
        { label: '24px', value: '24' },
        { label: '32px', value: '32' },
        { label: '48px', value: '48' },
    ]

    const fontFamilies = [
        { label: 'Default', value: '' },
        { label: 'Arial', value: 'Arial, sans-serif' },
        { label: 'Times New Roman', value: '"Times New Roman", serif' },
        { label: 'Courier New', value: '"Courier New", monospace' },
        { label: 'Georgia', value: 'Georgia, serif' },
        { label: 'Verdana', value: 'Verdana, sans-serif' },
        { label: 'Roboto', value: '"Roboto", sans-serif' },
    ]

    const currentFontSize = editor.getAttributes('textStyle').fontSize || '16'
    const currentFontFamily = editor.getAttributes('fontFamily') || ''


    return (
        <div className="border-b bg-background p-2 flex flex-wrap gap-1 sticky top-0 z-10 items-center">

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button" variant="ghost" size="sm" className="h-8 gap-1">
                        <Type className="h-4 w-4" />
                        <span className="sr-only">Typography</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[12rem]">
                    <DropdownMenuItem 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="gap-2 px-3 py-2"
                    >
                        <Heading1 className="h-4 w-4" /> 
                        <span>Heading 1</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="gap-2 px-3 py-2"
                    >
                        <Heading2 className="h-4 w-4" /> 
                        <span>Heading 2</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className="gap-2 px-3 py-2"
                    >
                        <Heading3 className="h-4 w-4" /> 
                        <span>Heading 3</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        className="gap-2 px-3 py-2"
                    >
                        <span>Paragraph</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className="gap-2 px-3 py-2"
                    >
                        <Quote className="h-4 w-4" /> 
                        <span>Blockquote</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className="gap-2 px-3 py-2"
                    >
                        <Code className="h-4 w-4" /> 
                        <span>Code Block</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={insertDetails}
                        className="gap-2 px-3 py-2"
                    >
                        <ChevronRight className="h-4 w-4" /> 
                        <span>Details / Spoiler</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                    e.preventDefault()
                    editor.chain().focus().toggleBold().run()
                }}
                data-state={editor.isActive('bold') ? 'on' : 'off'}
                title="Bold (Ctrl+B)"
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                    e.preventDefault()
                    editor.chain().focus().toggleItalic().run()
                }}
                data-state={editor.isActive('italic') ? 'on' : 'off'}
                title="Italic (Ctrl+I)"
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                    e.preventDefault()
                    editor.chain().focus().toggleStrike().run()
                }}
                data-state={editor.isActive('strike') ? 'on' : 'off'}
                title="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                    e.preventDefault()
                    editor.chain().focus().toggleUnderline().run()
                }}
                data-state={editor.isActive('underline') ? 'on' : 'off'}
                title="Underline"
            >
                <span className="underline font-bold text-sm">U</span>
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                    e.preventDefault()
                    editor.chain().focus().toggleHighlight().run()
                }}
                data-state={editor.isActive('highlight') ? 'on' : 'off'}
                title="Highlight"
            >
                <Highlighter className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1 mx-1">
                <input
                    type="color"
                    onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                    value={editor.getAttributes('textStyle').color || '#000000'}
                    className="h-6 w-6 p-0 border-0 overflow-hidden rounded cursor-pointer"
                    title="Text Color"
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button" variant="ghost" size="sm" className="h-8 gap-1">
                        <span className="text-xs">{currentFontSize}px</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {fontSizes.map((size) => (
                        <DropdownMenuItem
                            key={size.value}
                            onClick={() => editor.chain().focus().setFontSize(size.value).run()}
                        >
                            {size.label}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => editor.chain().focus().unsetFontSize().run()}>
                        Reset Size
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button" variant="ghost" size="sm" className="h-8 gap-1">
                        <span className="text-xs">
                            {fontFamilies.find(f => f.value === currentFontFamily)?.label || 'Font'}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {fontFamilies.map((font) => (
                        <DropdownMenuItem
                            key={font.value}
                            onClick={() => {
                                if (font.value) {
                                    editor.chain().focus().setFontFamily(font.value).run()
                                } else {
                                    editor.chain().focus().unsetFontFamily().run()
                                }
                            }}
                        >
                            {font.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                data-state={editor.isActive({ textAlign: 'left' }) ? 'on' : 'off'}
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                data-state={editor.isActive({ textAlign: 'center' }) ? 'on' : 'off'}
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                data-state={editor.isActive({ textAlign: 'right' }) ? 'on' : 'off'}
            >
                <AlignRight className="h-4 w-4" />
            </Button>


            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-state={editor.isActive('bulletList') ? 'on' : 'off'}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-state={editor.isActive('orderedList') ? 'on' : 'off'}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                data-state={editor.isActive('taskList') ? 'on' : 'off'}
            >
                <CheckSquare className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button" variant="ghost" size="sm" className="h-8 gap-1">
                        <TableIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                        Insert Table
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>Add Col Before</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>Add Col After</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>Delete Col</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>Add Row Before</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>Add Row After</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>Delete Row</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>Delete Table</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>Merge Cells</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={setLink}
                data-state={editor.isActive('link') ? 'on' : 'off'}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={addImage}
            >
                <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={insertYoutube}
            >
                <Youtube className="h-4 w-4" />
            </Button>

            <div className="flex-1" />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                },
                codeBlock: false,
                dropcursor: {
                    color: '#555',
                    width: 2
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing your post...',
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg border border-border',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full my-4',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            Highlight,
            Underline,
            TextStyle,
            Color,
            FontSize,
            FontFamily,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Mention.configure({
                HTMLAttributes: {
                    class: 'bg-primary/10 text-primary rounded px-1 py-0.5 font-medium',
                },
            }),
            Details,
            Summary,
            YoutubeNode,
            // Extensions for drag context menu
            UiState,
            NodeBackground,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-6 prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-5 prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4 prose-p:leading-relaxed prose-p:text-foreground prose-p:my-4 prose-p:text-base prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:font-semibold prose-strong:text-foreground prose-em:italic prose-code:text-sm prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:text-foreground prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-4 prose-pre:overflow-x-auto prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-lg prose-ul:list-disc prose-ul:my-4 prose-ol:list-decimal prose-ol:my-4 prose-li:marker:text-muted-foreground prose-li:my-2 prose-li:pl-1 prose-hr:border-border prose-hr:my-8 prose-img:rounded-lg prose-img:shadow-sm',
            },
            handlePaste: (view, event) => {
                const text = event.clipboardData?.getData('text/plain') || ''
                const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                const match = text.match(youtubeRegex)
                if (match) {
                    event.preventDefault()
                    const videoId = match[1]
                    const { state, dispatch } = view
                    const { tr } = state
                    const youtubeNode = YoutubeNode.create({
                        src: `https://www.youtube.com/watch?v=${videoId}`,
                        width: 640,
                        height: 360,
                    })
                    tr.replaceSelectionWith(youtubeNode)
                    dispatch(tr)
                    return true
                }
                return false
            },
        },
    })

    useEffect(() => {
        if (!editor || !content) return

        if (editor.getHTML() !== content) {
            const currentContent = editor.getHTML()
            if (currentContent === '<p></p>' && content !== '<p></p>') {
                editor.commands.setContent(content)
            } else if (Math.abs(currentContent.length - content.length) > 10) {
                // Fallback for larger changes
            }
        }
    }, [content, editor])


    if (!editor) {
        return null
    }

    return (
        <EditorContext.Provider value={{ editor }}>
            <div className="border rounded-lg overflow-hidden bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
                <MenuBar editor={editor} />
                <div className="editor-content-wrapper relative">
                    <EditorContent editor={editor} />
                    <DragContextMenu editor={editor} />
                </div>
            </div>
        </EditorContext.Provider>
    )
}
