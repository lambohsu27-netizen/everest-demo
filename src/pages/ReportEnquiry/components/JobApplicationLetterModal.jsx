import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { File02 } from '@untitled-ui/icons-react'
import { MyConfirmModalWithChildren } from '@interstellar-component'
import { format } from 'date-fns'

function formatDob(dateStr) {
  if (!dateStr) return null
  try {
    return format(new Date(dateStr), 'd MMMM yyyy')
  } catch {
    return null
  }
}

function buildLetterContent(data) {
  const companyName = data?.companyName || '[Nama Perusahaan]'
  const fullName = data?.fullName || '[Nama Lengkap]'
  const birthPlace = data?.birthPlace || null
  const dob = formatDob(data?.dateOfBirth)
  const placeAndDob =
    birthPlace && dob
      ? `${birthPlace}, ${dob}`
      : dob || birthPlace || '[Tempat, Tanggal Lahir]'
  const email = data?.email || '[Alamat Email]'

  return `
    <p>Kepada Yth.<br>HRD / Bagian Sumber Daya Manusia<br><strong>${companyName}</strong><br>di Tempat</p>
    <p>Dengan hormat,<br>Saya yang bertanda tangan di bawah ini:</p>
    <p>Nama lengkap : <strong>${fullName}</strong><br>Tempat, tanggal lahir : <strong>${placeAndDob}</strong><br>Email : <strong>${email}</strong></p>
    <p>Dengan ini mengajukan lamaran pekerjaan di <strong>${companyName}</strong>. Saya bersedia mengikuti seluruh proses seleksi sesuai dengan ketentuan yang berlaku.</p>
    <p>Demikian surat lamaran ini saya sampaikan. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.</p>
    <p>Hormat saya,<br><strong>${fullName}</strong></p>
  `
}

export default function JobApplicationLetterModal({
  open,
  onClose,
  content,
  data,
  zIndex = 3000,
}) {
  const resolvedContent = content || buildLetterContent(data)

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: resolvedContent,
      editable: false,
      editorProps: {
        attributes: {
          class:
            'prose prose-sm max-w-none focus:outline-none text-[#535862] leading-relaxed',
        },
      },
    },
    [resolvedContent, open]
  )

  React.useEffect(() => {
    if (editor && open) {
      editor.commands.setContent(resolvedContent)
    }
  }, [editor, open, resolvedContent])

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
