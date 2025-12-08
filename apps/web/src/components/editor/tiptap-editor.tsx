'use client'

import { useEditor, EditorContent } from '@tiptap/react'
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
import { Node, mergeAttributes } from '@tiptap/core'

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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCallback, useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

// Create lowlight instance
const lowlight = createLowlight(common)

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
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                        <Heading1 className="h-4 w-4 mr-2" /> Heading 1
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                        <Heading2 className="h-4 w-4 mr-2" /> Heading 2
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                        <Heading3 className="h-4 w-4 mr-2" /> Heading 3
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
                        Paragraph
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                        <Quote className="h-4 w-4 mr-2" /> Blockquote
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                        <Code className="h-4 w-4 mr-2" /> Code Block
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={insertDetails}>
                        <ChevronRight className="h-4 w-4 mr-2" /> Details / Spoiler
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-state={editor.isActive('bold') ? 'on' : 'off'}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-state={editor.isActive('italic') ? 'on' : 'off'}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                data-state={editor.isActive('strike') ? 'on' : 'off'}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                data-state={editor.isActive('underline') ? 'on' : 'off'}
            >
                <span className="underline font-bold text-sm">U</span>
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                data-state={editor.isActive('highlight') ? 'on' : 'off'}
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
                }
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
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
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
        <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
