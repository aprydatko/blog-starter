import { useCallback, useEffect, useMemo, useState } from 'react'

import { RichTextProvider } from '@blog-starter/tiptap-editor'

// Base Kit
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style'
import { ListItem } from '@tiptap/extension-list'

// build extensions
import { Clear, RichTextClear } from '@blog-starter/tiptap-editor/clear'
import { Bold, RichTextBold } from '@blog-starter/tiptap-editor/bold'
import { Italic, RichTextItalic } from '@blog-starter/tiptap-editor/italic'
import { TextUnderline, RichTextUnderline } from '@blog-starter/tiptap-editor/textunderline'
import { Strike, RichTextStrike } from '@blog-starter/tiptap-editor/strike'
import { MoreMark, RichTextMoreMark } from '@blog-starter/tiptap-editor/moremark'
import { Emoji, RichTextEmoji } from '@blog-starter/tiptap-editor/emoji'
import { Color, RichTextColor } from '@blog-starter/tiptap-editor/color'
import { Highlight, RichTextHighlight } from '@blog-starter/tiptap-editor/highlight'
import { Column, ColumnNode, MultipleColumnNode } from '@blog-starter/tiptap-editor/column'

import '@blog-starter/tiptap-editor/style.css'
import { EditorContent, useEditor } from '@tiptap/react'
import React from 'react'

// custom document to support columns
const DocumentColumn = /* @__PURE__ */ Document.extend({
  content: '(block|columns)+',
  // echo editor is a block editor
})

const BaseKit = [
  DocumentColumn,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: "Write your comment line",
  }),
]

const extensions = [
  ...BaseKit,
  
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji,
  Color,
  Highlight,
  Column,
  ColumnNode,
  MultipleColumnNode,
]

const RichTextToolbar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap border-b border-solid">
      <RichTextBold />
      <RichTextItalic />
      <RichTextUnderline />
      <RichTextStrike />
      <RichTextMoreMark />
      <RichTextEmoji />
      <RichTextColor />
      <RichTextHighlight />
    </div>
  )
}

export interface TiptapEditorRef {
  clearContent: () => void
}

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

const App = React.forwardRef<TiptapEditorRef, TiptapEditorProps>(({ content, onChange }, ref) => {
  const [theme, setTheme] = useState('light')

  function debounce(func: any, wait: number) {
    let timeout: NodeJS.Timeout
    return function (...args: any[]) {
      clearTimeout(timeout)
      // @ts-ignore
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  const debouncedOnChange = useMemo(
    () =>
      debounce((value: any) => {
        onChange(value)
      }, 300),
    [onChange] // Only recreate the debounced function when `onChange` changes
  )

  const onValueChange = useCallback(
    (value: any) => {
      debouncedOnChange(value)
    },
    [debouncedOnChange] // Ensure that `debouncedOnChange` is the dependency
  )

  const editor = useEditor({
    // shouldRerenderOnTransaction:  false,
    textDirection: 'auto', // global text direction
    content,
    extensions,
    immediatelyRender: false, // error duplicate plugin key
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onValueChange(html)
    },
  })

    // Expose clearContent method via ref
  React.useImperativeHandle(ref, () => ({
    clearContent: () => {
      if (editor) {
        editor.commands.clearContent(true)
      }
    }
  }), [editor])

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content === '') {
      editor.commands.clearContent(true)
    }
  }, [content, editor])

  useEffect(() => {
    ;(window as Record<string, any>)['editor'] = editor
  }, [editor])

  return (
    <div
      className="p-[24px] flex flex-col w-full max-w-screen-lg gap-[24px] mx-[auto] my-0"
      style={{
        maxWidth: 1400,
        margin: '40px auto',
      }}
    >
      {editor && (
        <RichTextProvider editor={editor} dark={theme === 'dark'}>
          <div className="overflow-hidden rounded-[0.5rem] bg-background shadow outline outline-1">
            <div className="flex max-h-full w-full flex-col">
              <RichTextToolbar />
              <EditorContent editor={editor} />
            </div>
          </div>
        </RichTextProvider>
      )}
    </div>
  )
})

App.displayName = 'TiptapEditor'

export default App
