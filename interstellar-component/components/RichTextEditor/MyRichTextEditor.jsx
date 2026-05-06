import { useCallback, useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import {
  Bold01,
  Check,
  ChevronDown,
  Italic01,
  Link01,
  List,
} from '@untitled-ui/icons-react'
import MyPopper from '../Popper/MyPopper'

function MenuButton({ onClick, isActive, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 transition-colors rounded-md flex items-center justify-center ${
        isActive
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
      }`}
      title={title}
    >
      {children}
    </button>
  )
}

function MenuBar({ editor }) {
  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  const getCurrentHeadingLabel = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1'
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
    return 'Regular'
  }

  const options = [
    { label: 'Regular', value: 'p' },
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
  ]

  const handleSelect = (val) => {
    if (val === 'p') {
      editor.chain().focus().setParagraph().run()
    } else {
      const level = parseInt(val.replace('h', ''), 10)
      editor.chain().focus().toggleHeading({ level }).run()
    }
  }

  return (
    <div className="flex items-center gap-1 mb-2 bg-transparent">
      <MyPopper
        placement="bottom-start"
        target={(open, show) => (
          <button
            type="button"
            onClick={show}
            className="h-11 px-3.5 flex items-center gap-2 text-sm font-medium text-[#181d27] bg-white border border-[#d5d7da] rounded-lg focus:outline-none shadow-sm min-w-[124px] justify-between group"
          >
            <span className="truncate">{getCurrentHeadingLabel()}</span>
            <ChevronDown
              className={`size-5 text-[#717680] transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      >
        {(open, anchorEl, show, close) => (
          <div className="flex flex-col min-w-[160px] py-1 bg-white">
            {options.map((option) => {
              const active =
                option.value === 'p'
                  ? !editor.isActive('heading')
                  : editor.isActive('heading', { level: parseInt(option.value.replace('h', ''), 10) })
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    handleSelect(option.value)
                    close()
                  }}
                  className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-[#181d27] hover:bg-gray-50 text-left transition-colors"
                >
                  {option.label}
                  {active && <Check className="size-4 text-brand/900" />}
                </button>
              )
            })}
          </div>
        )}
      </MyPopper>

      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <Bold01 className="size-5" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <Italic01 className="size-5" />
      </MenuButton>

      <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
        <Link01 className="size-5" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List className="size-5" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <svg
          className="size-5 text-gray-400"
          width="19"
          height="16"
          viewBox="0 0 19 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 13H2V13.5H1V14.5H2V15H0V16H3V12H0V13ZM1 4H2V0H0V1H1V4ZM0 7H1.8L0 9.1V10H3V9H1.2L3 6.9V6H0V7ZM5 1V3H19V1H5ZM5 15H19V13H5V15ZM5 9H19V7H5V9Z"
            fill="currentColor"
          />
        </svg>
      </MenuButton>
    </div>
  )
}

function MyRichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-disc ml-4 my-2',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'list-decimal ml-4 my-2',
          },
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: 'text-[#6941C6] underline cursor-pointer',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Underline,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none min-h-[350px] p-4 text-[#414651] leading-relaxed',
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      onChange(updatedEditor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="flex flex-col w-full">
      <MenuBar editor={editor} />
      <style>{`.ProseMirror ol ol { list-style-type: lower-alpha; }`}</style>
      <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
        <EditorContent editor={editor} className="overflow-y-auto max-h-[500px]" />
      </div>
    </div>
  )
}

export default MyRichTextEditor
