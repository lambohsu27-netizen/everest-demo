import { useEffect } from 'react'
import { useApp } from '@src/AppContext'
import { Access } from '@src/services/Helper'
import { useSettings } from '../Context'
import EditorSection from './EditorSection'

export default function ConsentEditor() {
  const { hasPermission } = useApp()
  const {
    candidateContent,
    setCandidateContent,
    existingContent,
    setExistingContent,
    isLoadingConsent,
    isSavingConsent,
    fetchConsentEditor,
    updateConsentEditor,
    cancelConsentEditor,
  } = useSettings()

  const canEdit = hasPermission(Access.CONSENT_EDITOR, 'edit')

  useEffect(() => {
    if (canEdit) fetchConsentEditor()
  }, [canEdit, fetchConsentEditor])

  if (isLoadingConsent) {
    return (
      <div className="flex items-center justify-center pt-16">
        <span className="text-sm text-[#535862]">Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <EditorSection
        title="Candidate"
        content={candidateContent}
        onUpdate={setCandidateContent}
        onSave={() => updateConsentEditor('candidate')}
        onCancel={() => cancelConsentEditor('candidate')}
        isSaving={isSavingConsent.candidate}
        canEdit={canEdit}
      />
      <EditorSection
        title="Existing"
        content={existingContent}
        onUpdate={setExistingContent}
        onSave={() => updateConsentEditor('existing')}
        onCancel={() => cancelConsentEditor('existing')}
        isSaving={isSavingConsent.existing}
        canEdit={canEdit}
      />
    </div>
  )
}
