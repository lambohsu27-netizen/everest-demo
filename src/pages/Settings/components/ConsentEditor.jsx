import { useState } from 'react'
import EditorSection from './EditorSection'

export default function ConsentEditor() {
  const [candidateContent, setCandidateContent] = useState('')
  const [existingContent, setExistingContent] = useState('')

  return (
    <div className="flex flex-col">
      <EditorSection title="Candidate" content={candidateContent} onUpdate={setCandidateContent} />
      <EditorSection title="Existing" content={existingContent} onUpdate={setExistingContent} />
    </div>
  )
}
