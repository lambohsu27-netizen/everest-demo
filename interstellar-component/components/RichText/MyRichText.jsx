import React, { useState, useEffect } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToMarkdown from 'draftjs-to-markdown'
import { stateToHTML } from 'draft-js-export-html'
import { stateFromHTML } from 'draft-js-import-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import htmlToDraft from 'html-to-draftjs'

const RichTextEditor = ({ initialHTML, onChange }) => {
  const [editorState, setEditorState] = useState(() => {
    // const contentState = initialHTML
    //   ? htmlToDraft(initialHTML)
    //   : ContentState.createFromText('')
    // console.log(initialHTML)
    const contentBlock = htmlToDraft(initialHTML)
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    )

    return EditorState.createWithContent(contentState)
  })

  // useEffect(() => {
  //   if (initialHTML) {
  //     const contentState = stateFromHTML(initialHTML)
  //     setEditorState(EditorState.createWithContent(contentState))
  //   }
  // }, [initialHTML])

  const handleEditorChange = (state) => {
    setEditorState(state)
    const rawContent = convertToRaw(state.getCurrentContent())
    const markdownContent = draftToMarkdown(rawContent)
    if (onChange) {
      onChange(markdownContent)

      // console.log(markdownContent)
    }
  }
  // console.log(draftToMarkdown(convertToRaw(editorState.getCurrentContent())))
  return (
    <div>
      <Editor
        toolbar={{
          options: [
            'inline',
            'fontSize',
            'fontFamily',
            'list',
            'colorPicker',
            'textAlign',
            'link',
            'embedded',
            'image',
            'history',
          ],
        }}
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="border border-gray-light/300 rounded-lg"
        toolbarClassName="border-b border-x-0 border-t-0 border-gray-light/300 rounded-t-lg"
        editorClassName="px-1.5"
      />
      {/* <textarea
        disabled
        value={
          editorState
            ? draftToMarkdown(convertToRaw(editorState.getCurrentContent()))
            : ''
        }
      /> */}
    </div>
  )
}

export default RichTextEditor
