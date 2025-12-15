import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { RichTextProvider } from '@blog-starter/tiptap-editor'

import { localeActions } from '@blog-starter/tiptap-editor/locale-bundle'

import { themeActions } from '@blog-starter/tiptap-editor/theme'


// Base Kit
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

// build extensions
import { History, RichTextUndo, RichTextRedo } from '@blog-starter/tiptap-editor/history';
import { SearchAndReplace, RichTextSearchAndReplace } from '@blog-starter/tiptap-editor/searchandreplace';
import { Clear, RichTextClear } from '@blog-starter/tiptap-editor/clear';
import { FontFamily, RichTextFontFamily } from '@blog-starter/tiptap-editor/fontfamily';
import { Heading, RichTextHeading } from '@blog-starter/tiptap-editor/heading';
import { FontSize, RichTextFontSize } from '@blog-starter/tiptap-editor/fontsize';
import { Bold, RichTextBold } from '@blog-starter/tiptap-editor/bold';
import { Italic, RichTextItalic } from '@blog-starter/tiptap-editor/italic';
import { TextUnderline, RichTextUnderline } from '@blog-starter/tiptap-editor/textunderline';
import { Strike, RichTextStrike } from '@blog-starter/tiptap-editor/strike';
import { MoreMark, RichTextMoreMark } from '@blog-starter/tiptap-editor/moremark';
import { Emoji, RichTextEmoji } from '@blog-starter/tiptap-editor/emoji';
import { Color, RichTextColor } from '@blog-starter/tiptap-editor/color';
import { Highlight, RichTextHighlight } from '@blog-starter/tiptap-editor/highlight';
import { BulletList, RichTextBulletList } from '@blog-starter/tiptap-editor/bulletlist';
import { OrderedList, RichTextOrderedList } from '@blog-starter/tiptap-editor/orderedlist';
import { TextAlign, RichTextAlign } from '@blog-starter/tiptap-editor/textalign';
import { Indent, RichTextIndent } from '@blog-starter/tiptap-editor/indent';
import { LineHeight, RichTextLineHeight } from '@blog-starter/tiptap-editor/lineheight';
import { TaskList, RichTextTaskList } from '@blog-starter/tiptap-editor/tasklist';
import { Link, RichTextLink } from '@blog-starter/tiptap-editor/link';
import { Image, RichTextImage } from '@blog-starter/tiptap-editor/image';
import { Video, RichTextVideo } from '@blog-starter/tiptap-editor/video';
import { ImageGif, RichTextImageGif } from '@blog-starter/tiptap-editor/imagegif';
import { Blockquote, RichTextBlockquote } from '@blog-starter/tiptap-editor/blockquote';
import { HorizontalRule, RichTextHorizontalRule } from '@blog-starter/tiptap-editor/horizontalrule';
import { Code, RichTextCode } from '@blog-starter/tiptap-editor/code';
import { CodeBlock, RichTextCodeBlock } from '@blog-starter/tiptap-editor/codeblock';
import { Column, ColumnNode, MultipleColumnNode, RichTextColumn } from '@blog-starter/tiptap-editor/column';
import { Table, RichTextTable } from '@blog-starter/tiptap-editor/table';
import { Iframe, RichTextIframe } from '@blog-starter/tiptap-editor/iframe';
import { ExportPdf, RichTextExportPdf } from '@blog-starter/tiptap-editor/exportpdf';
import { ImportWord, RichTextImportWord } from '@blog-starter/tiptap-editor/importword';
import { ExportWord, RichTextExportWord } from '@blog-starter/tiptap-editor/exportword';
import { TextDirection, RichTextTextDirection } from '@blog-starter/tiptap-editor/textdirection';
import { Attachment, RichTextAttachment } from '@blog-starter/tiptap-editor/attachment';
import { Katex, RichTextKatex } from '@blog-starter/tiptap-editor/katex';
import { Excalidraw, RichTextExcalidraw } from '@blog-starter/tiptap-editor/excalidraw';
import { Mermaid, RichTextMermaid } from '@blog-starter/tiptap-editor/mermaid';
import { Drawer, RichTextDrawer } from '@blog-starter/tiptap-editor/drawer';
import { Twitter, RichTextTwitter } from '@blog-starter/tiptap-editor/twitter';
import { Mention } from '@blog-starter/tiptap-editor/mention';
import { CodeView, RichTextCodeView } from '@blog-starter/tiptap-editor/codeview';
import { Fullscreen, Moon, Sun } from 'lucide-react'

// Slash Command
import { SlashCommand, SlashCommandList } from '@blog-starter/tiptap-editor/slashcommand';


// Bubble
import {
  RichTextBubbleColumns,
  RichTextBubbleDrawer,
  RichTextBubbleExcalidraw,
  RichTextBubbleIframe,
  RichTextBubbleKatex,
  RichTextBubbleLink,
  RichTextBubbleImage,
  RichTextBubbleVideo,
  RichTextBubbleImageGif,
  RichTextBubbleMermaid,
  RichTextBubbleTable,
  RichTextBubbleText,
  RichTextBubbleTwitter,
  RichTextBubbleMenuDragHandle
} from '@blog-starter/tiptap-editor/bubble';

import '@blog-starter/tiptap-editor/style.css'
import 'prism-code-editor-lightweight/layout.css';
import "prism-code-editor-lightweight/themes/github-dark.css"
import 'katex/dist/katex.min.css'
import 'easydrawer/styles.css'
import "@excalidraw/excalidraw/index.css";

// import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCaret from '@tiptap/extension-collaboration-caret'
// import { HocuspocusProvider } from '@hocuspocus/provider'
// import * as Y from 'yjs'
import { EditorContent, useEditor } from '@tiptap/react';
import { Button } from '@blog-starter/ui/button'

// const ydoc = new Y.Doc()

// const hocuspocusProvider = new HocuspocusProvider({
//   url: 'ws://0.0.0.0:8080',
//   name: 'github.com/hunghg255',
//   document: ydoc,
// })

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function convertBase64ToBlob(base64: string) {
  const arr = base64.split(',')
  const mime = arr[0]?.match(/:(.*?);/)![1]
  const bstr = atob(arr[1]!)
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// custom document to support columns
const DocumentColumn = /* @__PURE__ */ Document.extend({
  content: '(block|columns)+',
  // echo editor is a block editor
});

const uploadImage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    if (!data.success) {
      throw new Error(data.error)
    }
    return data.url
  } catch (error) {
    console.error('Failed to upload', error)
    throw new Error('Failed to upload')
  }
}

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
    placeholder: 'Press \'/\' for commands',
  })
]

const extensions = [
  ...BaseKit,

  History,
  SearchAndReplace,
  Clear,
  FontFamily,
  Heading,
  FontSize,
  Heading,
  Bold,
  Italic,
  TextUnderline,
  Strike,
  MoreMark,
  Emoji,
  Color,
  Highlight,
  BulletList,
  OrderedList,
  TextAlign,
  Indent,
  LineHeight,
  TaskList,
  Link,
  Image.configure({
    upload: uploadImage,
  }),
  Video.configure({
    upload: (files: File) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(files))
        }, 300)
      })
    },
  }),
  ImageGif.configure({
    provider: 'giphy',
    API_KEY: process.env.VITE_GIPHY_API_KEY,
  }),
  Blockquote,
  HorizontalRule,
  Code,
  CodeBlock,

  Column,
  ColumnNode,
  MultipleColumnNode,
  Table,
  Iframe,
  ExportPdf,
  ImportWord,
  ExportWord,
  TextDirection,
  Attachment.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string)
          resolve(URL.createObjectURL(blob))
        }, 300)
      })
    },
  }),
  Katex,
  Excalidraw,
  Mermaid.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string)
          resolve(URL.createObjectURL(blob))
        }, 300)
      })
    },
  }),
  Drawer.configure({
    upload: (file: any) => {
      // fake upload return base 64
      const reader = new FileReader()
      reader.readAsDataURL(file)

      return new Promise((resolve) => {
        setTimeout(() => {
          const blob = convertBase64ToBlob(reader.result as string)
          resolve(URL.createObjectURL(blob))
        }, 300)
      })
    },
  }),
  Twitter,
  Mention,
  SlashCommand,
  CodeView,

  //  Collaboration.configure({
  //   document: hocuspocusProvider.document,
  // }),
  // CollaborationCaret.configure({
  //   provider: hocuspocusProvider,
  //   user: {
  //     color: getRandomColor(),
  //   },
  // }),
]

const DEFAULT = ``

function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timeout)
    // @ts-ignore
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}


const Header = ({ editor, theme, setTheme, fullScreen, setFullScreen }: any) => {
  const [editorEditable, setEditorEditable] = useState(false);

  useEffect(() => {
    setEditorEditable(editor?.isEditable ?? true);
  }, [editor?.isEditable]);

  useEffect(() => {
    if (editor) {
      editor.on('update', () => {
        setEditorEditable(editor.isEditable);
      })
    }

    return () => {
      if (editor) {
        editor.off('update', () => {
          setEditorEditable(editor.isEditable);
        })
      }
    }
  }, [editor]);

  return <>
    {fullScreen && (
      <div className=' top-0 left-0 right-0 z-50 bg-white dark:bg-background'>
        <h2 className="font-sans font-bold text-3xl text-secondary-foreground">Full Screen Mode</h2>
        <hr className="mt-4 mb-10 border-border" />
      </div>
    )}

    <div className='py-4 flex items-center gap-2'>
      <Button variant={theme === 'light' ? 'destructive' : 'ghost'} onClick={() => {
        themeActions.setTheme('light');
      }}>
        <Sun className='w-4 h-4' />
      </Button>
      <Button variant={theme === 'dark' ? 'destructive' : 'ghost'} onClick={() => {
        themeActions.setTheme('dark');
      }}>
        <Moon className='w-4 h-4' />
      </Button>
      <Button variant={fullScreen ? 'destructive' : 'ghost'} onClick={() => {
        setFullScreen(!fullScreen);
      }}>
        <Fullscreen className='w-4 h-4' />
      </Button>
    </div>

    {/* <div className='flex items-center gap-1'>
      <button className="border border-solid border-gray-500 p-1" onClick={() => {
        themeActions.setColor('default');
      }} >Color default</button>
      <button className="border border-solid border-gray-500 p-1" onClick={() => {
        themeActions.setColor('red');
      }} >Theme red</button>

      <button className="border border-solid border-gray-500 p-1" onClick={() => {
        themeActions.setColor('blue');
      }} >Theme blue</button>

      <button className="border border-solid border-gray-500 p-1" onClick={() => {
        themeActions.setColor('green');
      }} >Theme green</button>

      <button className="border border-solid border-gray-500 p-1" onClick={() => {
        themeActions.setColor('orange');
      }} >Theme orange</button>

      <button className="border border-solid border-gray-500 p-1" onClick={() => {
        themeActions.setColor('rose');
      }} >Theme rose</button>

      <button className="border border-solid border-gray-500 p-1" onClick={() => {
        themeActions.setColor('violet');
      }} >Theme violet</button>

      <button className="border border-solid border-gray-500 p-1" onClick={() => {
        themeActions.setColor('yellow');
      }} >Theme yellow</button>
    </div> */}
  </>
}

const RichTextToolbar = () => {

  return <div className="flex items-center gap-2 flex-wrap bg-background dark:bg-white/5">
    <RichTextUndo />
    <RichTextRedo />
    <RichTextSearchAndReplace />
    <RichTextClear />
    <RichTextFontFamily />
    <RichTextHeading />
    <RichTextFontSize />
    <RichTextBold />
    <RichTextItalic />
    <RichTextUnderline />
    <RichTextStrike />
    <RichTextMoreMark />
    <RichTextEmoji />
    <RichTextColor />
    <RichTextHighlight />
    <RichTextBulletList />
    <RichTextOrderedList />
    <RichTextAlign />
    <RichTextIndent />
    <RichTextLineHeight />
    <RichTextTaskList />
    <RichTextLink />
    <RichTextImage />
    <RichTextVideo />
    <RichTextImageGif />
    <RichTextBlockquote />
    <RichTextHorizontalRule />
    <RichTextCode />
    <RichTextCodeBlock />
    <RichTextColumn />
    <RichTextTable />
    <RichTextIframe />
    <RichTextExportPdf />
    <RichTextImportWord />
    <RichTextExportWord />
    <RichTextTextDirection />
    <RichTextAttachment />
    <RichTextKatex />
    <RichTextExcalidraw />
    <RichTextMermaid />
    <RichTextDrawer />
    <RichTextTwitter />
    <RichTextCodeView />
  </div>
}

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

function App({ content, onChange }: TiptapEditorProps) {
  const [theme, setTheme] = useState('light')
  const [fullScreen, setFullScreen] = useState(false)

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

  useEffect(() => {
    ; (window as Record<string, any>)['editor'] = editor
  }, [editor])


  return (
    <div className={fullScreen ? 'p-6 absolute left-0 right-0 bottom-0 top-0 bg-white dark:bg-background z-50 overflow-y-auto' : 'flex flex-col w-full max-w-5xl gap-6 mx-auto my-0'}>
      <Header editor={editor} setTheme={setTheme} theme={theme} fullScreen={fullScreen} setFullScreen={setFullScreen} />

      {editor && (
        <RichTextProvider editor={editor}
          dark={theme === 'dark'}
        >
          <div className="overflow-hidden rounded-lg shadow-none outline outline-1 outline-border">
            <div className="flex max-h-full w-full flex-col">
              <RichTextToolbar />

              <div className="">
                <EditorContent
                  editor={editor}
                />
              </div>

              {/* Bubble */}
              <RichTextBubbleColumns />
              <RichTextBubbleDrawer />
              <RichTextBubbleExcalidraw />
              <RichTextBubbleIframe />
              <RichTextBubbleKatex />
              <RichTextBubbleLink />

              <RichTextBubbleImage />
              <RichTextBubbleVideo />
              <RichTextBubbleImageGif />

              <RichTextBubbleMermaid />
              <RichTextBubbleTable />
              <RichTextBubbleText />
              <RichTextBubbleTwitter />

              {/* <RichTextBubbleMenuDragHandle /> */}

              {/* Command List */}
              <SlashCommandList />

            </div>
          </div>
        </RichTextProvider>
      )}
    </div>
  )
}

export default App
