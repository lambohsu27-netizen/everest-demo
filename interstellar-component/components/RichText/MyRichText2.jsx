// import React, { useState } from 'react'
// import ReactQuill from 'react-quill'
// import 'react-quill/dist/quill.snow.css'

// const RichTextEditor = () => {
//   const [value, setValue] = useState('')

//   const modules = {
//     toolbar: [
//       [{ font: [] }], // Font family
//       [
//         {
//           size: [
//             '10px',
//             '12px',
//             '14px',
//             '16px',
//             '18px',
//             '24px',
//             '32px',
//             '48px',
//           ],
//         },
//       ], // Font size
//       [{ align: [] }], // Align (left, center, right, justify)
//       [{ list: 'ordered' }, { list: 'bullet' }], // Ordered and bullet list
//       [{ color: [] }, { background: [] }], // Text color and background highlight
//       ['bold', 'italic', 'underline'], // Text styling
//       ['link', 'image'], // Link and image insert
//     ],
//   }

//   const formats = [
//     'font',
//     'size',
//     'align',
//     'list',
//     'bullet',
//     'color',
//     'background',
//     'bold',
//     'italic',
//     'underline',
//     'link',
//     'image',
//   ]

//   return (
//     <div className="rich-text-editor">
//       <ReactQuill

//         value={value}
//         onChange={setValue}
//         modules={modules}
//         formats={formats}
//         placeholder="Start typing..."
//       />
//     </div>
//   )
// }

// export default RichTextEditor

import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Gaya tema default untuk Quill

const RichTextEditor = ({ value, onChange, errors }) => {
  const [editorValue, setEditorValue] = useState(value || '')

  const handleChange = (content, delta, source, editor) => {
    setEditorValue(content)
    if (onChange) {
      onChange(content)
    }
  }

  const modules = {
    toolbar: [
      [{ font: [] }, { size: ['small', false, 'large', 'huge'] }], // Font dan Ukuran
      [
        // { header: '1' },
        // { header: '2' },
        'bold',
        'italic',
        'underline',
        'strike',
      ], // Format teks
      [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }], // Align dan List
      [{ color: [] }, { background: [] }], // Warna teks dan latar belakang
      ['link', 'image'], // Link dan gambar
      // ['clean'], // Membersihkan format
    ],
  }

  const formats = [
    'font',
    'size',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'align',
    'list',
    'bullet',
    'color',
    'background',
    'link',
    'image',
  ]

  return (
    <div className="rich-text-editor">
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow" // Menggunakan tema default
      />
      {errors && (
        <p className="mt-1.5text-sm-medium text-error/600">{errors}</p>
      )}
    </div>
  )
}

export default RichTextEditor
