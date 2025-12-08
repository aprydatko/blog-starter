'use client'

import { useEditor, EditorContext } from '@tiptap/react'
import { DragHandle } from '@tiptap/extension-drag-handle-react'
import { useCallback, useState, useEffect, useContext } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@blog-starter/ui/dropdown-menu'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Copy,
  Trash2,
  RotateCcw,
  CheckSquare,
  Highlighter,
  Type,
  Link as LinkIcon,
  Download,
} from 'lucide-react'

interface DragContextMenuProps {
  editor?: ReturnType<typeof useEditor> | null
  withSlashCommandTrigger?: boolean
  mobileBreakpoint?: number
}

const COLORS = [
  { label: 'Default', value: null },
  { label: 'Grey', value: '#9e9e9e' },
  { label: 'Brown', value: '#795548' },
  { label: 'Red', value: '#f44336' },
  { label: 'Orange', value: '#ff9800' },
  { label: 'Yellow', value: '#ffeb3b' },
  { label: 'Green', value: '#4caf50' },
  { label: 'Blue', value: '#2196f3' },
  { label: 'Purple', value: '#9c27b0' },
  { label: 'Pink', value: '#e91e63' },
]

const HIGHLIGHTS = [
  { label: 'Default', value: null },
  { label: 'Grey', value: '#9e9e9e' },
  { label: 'Brown', value: '#795548' },
  { label: 'Red', value: '#f44336' },
  { label: 'Orange', value: '#ff9800' },
  { label: 'Yellow', value: '#ffeb3b' },
  { label: 'Green', value: '#4caf50' },
  { label: 'Blue', value: '#2196f3' },
  { label: 'Purple', value: '#9c27b0' },
  { label: 'Pink', value: '#e91e63' },
]

export function DragContextMenu({ 
  editor: editorProp, 
  withSlashCommandTrigger = true,
  mobileBreakpoint = 768 
}: DragContextMenuProps) {
  // Get editor from EditorContext if not provided via props
  const editorContext = useContext(EditorContext)
  const editor = editorProp || editorContext?.editor || null
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  useEffect(() => {
    if (!editor) return

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const dragHandle = target.closest('[data-drag-handle]')
      
      if (dragHandle) {
        event.preventDefault()
        event.stopPropagation()
        
        // Find the block node - DragHandle is typically positioned next to the block
        let blockElement: HTMLElement | null = null
        
        // Try to find the block element in various ways
        const parent = dragHandle.parentElement
        if (parent) {
          // Look for ProseMirror block elements
          blockElement = parent.querySelector('[data-type]') || 
                        parent.querySelector('p, h1, h2, h3, h4, h5, h6, blockquote, pre, ul, ol, li') ||
                        parent
        }
        
        if (blockElement) {
          try {
            const pos = editor.view.posAtDOM(blockElement, 0)
            const resolvedPos = editor.state.doc.resolve(pos)
            
            // Find the block node
            let depth = resolvedPos.depth
            while (depth > 0 && resolvedPos.node(depth).isInline) {
              depth--
            }
            
            if (depth > 0) {
              const start = resolvedPos.start(depth)
              const end = resolvedPos.end(depth)
              editor.chain().focus().setTextSelection({ from: start, to: end }).run()
              setIsOpen(true)
            } else {
              // Fallback: select current position
              editor.chain().focus().setTextSelection(pos).run()
              setIsOpen(true)
            }
          } catch (error) {
            // Fallback: use current selection
            const { from } = editor.state.selection
            editor.chain().focus().setTextSelection(from).run()
            setIsOpen(true)
          }
        }
      }
    }

    const editorElement = editor.view.dom
    editorElement.addEventListener('click', handleClick, true)
    return () => {
      editorElement.removeEventListener('click', handleClick, true)
    }
  }, [editor])

  if (!editor) {
    return null
  }

  // Don't show drag handle on mobile
  if (isMobile) {
    return null
  }

  const transformToHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor.chain().focus().toggleHeading({ level }).run()
      setIsOpen(false)
    },
    [editor]
  )

  const transformToParagraph = useCallback(() => {
    editor.chain().focus().setParagraph().run()
    setIsOpen(false)
  }, [editor])

  const transformToBlockquote = useCallback(() => {
    editor.chain().focus().toggleBlockquote().run()
    setIsOpen(false)
  }, [editor])

  const transformToCodeBlock = useCallback(() => {
    editor.chain().focus().toggleCodeBlock().run()
    setIsOpen(false)
  }, [editor])

  const transformToBulletList = useCallback(() => {
    editor.chain().focus().toggleBulletList().run()
    setIsOpen(false)
  }, [editor])

  const transformToOrderedList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run()
    setIsOpen(false)
  }, [editor])

  const transformToTaskList = useCallback(() => {
    editor.chain().focus().toggleTaskList().run()
    setIsOpen(false)
  }, [editor])

  const duplicateBlock = useCallback(() => {
    const { from, to } = editor.state.selection
    const content = editor.state.doc.slice(from, to)
    
    if (content.size > 0) {
      editor.chain().focus().insertContentAt(to, content.content).run()
    }
    setIsOpen(false)
  }, [editor])

  const copyBlock = useCallback(async () => {
    const { from, to } = editor.state.selection
    const html = editor.getHTML()
    
    try {
      // Try to copy as HTML first
      const blob = new Blob([html], { type: 'text/html' })
      const clipboardItem = new ClipboardItem({ 'text/html': blob })
      await navigator.clipboard.write([clipboardItem])
    } catch {
      // Fallback to plain text
      const text = editor.state.doc.textBetween(from, to)
      await navigator.clipboard.writeText(text)
    }
    setIsOpen(false)
  }, [editor])

  const copyAnchorLink = useCallback(async () => {
    const { from } = editor.state.selection
    const resolvedPos = editor.state.doc.resolve(from)
    const node = resolvedPos.parent
    
    // Try to get ID from node attributes
    const id = node.attrs.id || `heading-${from}`
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    
    await navigator.clipboard.writeText(url)
    setIsOpen(false)
  }, [editor])

  const deleteBlock = useCallback(() => {
    const { from, to } = editor.state.selection
    const resolvedPos = editor.state.doc.resolve(from)
    
    // Delete the entire block
    if (resolvedPos.depth > 0) {
      const start = resolvedPos.start(resolvedPos.depth)
      const end = resolvedPos.end(resolvedPos.depth)
      editor.chain().focus().deleteRange({ from: start, to: end }).run()
    } else {
      editor.chain().focus().deleteRange({ from, to }).run()
    }
    setIsOpen(false)
  }, [editor])

  const resetFormatting = useCallback(() => {
    editor.chain().focus().clearNodes().unsetAllMarks().run()
    setIsOpen(false)
  }, [editor])

  const setTextColor = useCallback((color: string | null) => {
    if (color) {
      editor.chain().focus().setColor(color).run()
    } else {
      editor.chain().focus().unsetColor().run()
    }
    setIsOpen(false)
  }, [editor])

  const setHighlight = useCallback((color: string | null) => {
    if (color) {
      editor.chain().focus().setHighlight({ color }).run()
    } else {
      editor.chain().focus().unsetHighlight().run()
    }
    setIsOpen(false)
  }, [editor])

  const downloadImage = useCallback(() => {
    const { from } = editor.state.selection
    const resolvedPos = editor.state.doc.resolve(from)
    const node = resolvedPos.nodeAfter || resolvedPos.nodeBefore
    
    if (node?.type.name === 'image' && node.attrs.src) {
      const link = document.createElement('a')
      link.href = node.attrs.src
      link.download = 'image.png'
      link.click()
    }
    setIsOpen(false)
  }, [editor])

  // Check if current node is an image
  const isImageNode = () => {
    const { from } = editor.state.selection
    const resolvedPos = editor.state.doc.resolve(from)
    const node = resolvedPos.nodeAfter || resolvedPos.nodeBefore
    return node?.type.name === 'image'
  }

  // Check if extensions are available
  const hasColorExtension = editor.extensionManager.extensions.find(ext => ext.name === 'color')
  const hasHighlightExtension = editor.extensionManager.extensions.find(ext => ext.name === 'highlight')
  const hasTaskListExtension = editor.extensionManager.extensions.find(ext => ext.name === 'taskList')
  const hasImageExtension = editor.extensionManager.extensions.find(ext => ext.name === 'image')

  const currentTextColor = editor.getAttributes('textStyle').color || null
  const currentHighlight = editor.getAttributes('highlight')?.color || null

  return (
    <>
      {editor && <DragHandle editor={editor}>{null}</DragHandle>}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuContent 
          align="start" 
          className="w-56 max-h-[80vh] overflow-y-auto"
          side="right"
          sideOffset={8}
        >
          <div className="px-2 py-1.5 text-sm font-semibold">Turn into</div>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={transformToParagraph} className="gap-2">
            <span>Paragraph</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => transformToHeading(1)}
            className="gap-2"
          >
            <Heading1 className="h-4 w-4" />
            <span>Heading 1</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => transformToHeading(2)}
            className="gap-2"
          >
            <Heading2 className="h-4 w-4" />
            <span>Heading 2</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => transformToHeading(3)}
            className="gap-2"
          >
            <Heading3 className="h-4 w-4" />
            <span>Heading 3</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={transformToBulletList} className="gap-2">
            <List className="h-4 w-4" />
            <span>Bullet List</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={transformToOrderedList} className="gap-2">
            <ListOrdered className="h-4 w-4" />
            <span>Numbered List</span>
          </DropdownMenuItem>
          
          {hasTaskListExtension && (
            <DropdownMenuItem onClick={transformToTaskList} className="gap-2">
              <CheckSquare className="h-4 w-4" />
              <span>Task List</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={transformToBlockquote} className="gap-2">
            <Quote className="h-4 w-4" />
            <span>Blockquote</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={transformToCodeBlock} className="gap-2">
            <Code className="h-4 w-4" />
            <span>Code Block</span>
          </DropdownMenuItem>

          {(hasColorExtension || hasHighlightExtension) && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-sm font-semibold">Colors</div>
              <DropdownMenuSeparator />
              
              {hasColorExtension && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <Type className="h-4 w-4" />
                    <span>Text Color</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48">
                    {COLORS.map((color) => (
                      <DropdownMenuItem
                        key={color.value || 'default'}
                        onClick={() => setTextColor(color.value)}
                        className="gap-2"
                      >
                        {color.value && (
                          <div
                            className="h-4 w-4 rounded border border-border"
                            style={{ backgroundColor: color.value }}
                          />
                        )}
                        <span>{color.label}</span>
                        {currentTextColor === color.value && (
                          <span className="ml-auto">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              
              {hasHighlightExtension && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <Highlighter className="h-4 w-4" />
                    <span>Highlight</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48">
                    {HIGHLIGHTS.map((highlight) => (
                      <DropdownMenuItem
                        key={highlight.value || 'default'}
                        onClick={() => setHighlight(highlight.value)}
                        className="gap-2"
                      >
                        {highlight.value && (
                          <div
                            className="h-4 w-4 rounded border border-border"
                            style={{ backgroundColor: highlight.value }}
                          />
                        )}
                        <span>{highlight.label}</span>
                        {currentHighlight === highlight.value && (
                          <span className="ml-auto">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
            </>
          )}

          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={copyBlock} className="gap-2">
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={duplicateBlock} className="gap-2">
            <Copy className="h-4 w-4" />
            <span>Duplicate</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={copyAnchorLink} className="gap-2">
            <LinkIcon className="h-4 w-4" />
            <span>Copy Anchor Link</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={resetFormatting} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            <span>Reset Formatting</span>
          </DropdownMenuItem>

          {hasImageExtension && isImageNode() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={downloadImage} className="gap-2">
                <Download className="h-4 w-4" />
                <span>Download Image</span>
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={deleteBlock}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
