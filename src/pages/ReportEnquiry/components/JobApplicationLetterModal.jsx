import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { File02 } from '@untitled-ui/icons-react'
import { MyConfirmModalWithChildren } from '@interstellar-component'

export default function JobApplicationLetterModal({ open, onClose, content, zIndex = 3000 }) {
  // Figma Default Content
  const defaultContent = `
    <p>Kepada Yth.<br>HRD / Bagian Sumber Daya Manusia<br><strong>[Nama Perusahaan]</strong><br>di Tempat</p>
    <p>Dengan hormat,<br>Saya yang bertanda tangan di bawah ini:</p>
    <p>Nama lengkap : <strong>[Nama Lengkap]</strong><br>Tempat, tanggal lahir : <strong>[Tempat, Tanggal Lahir]</strong><br>Email : <strong>[Alamat Email]</strong></p>
    <p>Dengan ini mengajukan lamaran pekerjaan di <strong>[Nama Perusahaan]</strong>. Saya bersedia mengikuti seluruh proses seleksi sesuai dengan ketentuan yang berlaku.</p>
    <p>Demikian surat lamaran ini saya sampaikan. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.</p>
    <p>Hormat saya,<br><strong>[Nama Lengkap]</strong></p>
  `

  const editor = useEditor({
    extensions: [StarterKit],
    content: content || defaultContent,
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none text-[#535862] leading-relaxed',
      },
    },
  }, [content, open])

  // Reset content when modal opens/content changes
  React.useEffect(() => {
    if (editor && open) {
      editor.commands.setContent(content || defaultContent)
    }
  }, [editor, open, content, defaultContent])

  return (
    <MyConfirmModalWithChildren
      open={open}
      onClose={onClose}
      zIndex={zIndex}
      forceBlur
      title="SURAT LAMARAN KERJA"
      icon={<File02 className="text-brand/900" />}
      bgColor="bg-white"
      disableBgPattern
      enableDoubleRing
      negativeActionWord={null}
      positiveActionWord="Close"
      onConfirm={onClose}
    >
      <div className="min-h-[300px] py-2">
        <EditorContent editor={editor} />
      </div>
      
      <style>{`
        .prose strong {
          color: #181d27;
          font-weight: 600;
        }
        .prose p {
          margin-bottom: 1rem;
        }
      `}</style>
    </MyConfirmModalWithChildren>
  )
}
