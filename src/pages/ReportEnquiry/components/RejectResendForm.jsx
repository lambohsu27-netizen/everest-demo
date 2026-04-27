import React, { useState } from 'react'
import { RefreshCw01, HelpCircle } from '@untitled-ui/icons-react'
import { 
  MyConfirmModalWithChildren, 
  MyTextArea, 
  MyCheckbox, 
  MyChip, 
  MyButton 
} from '@interstellar-component'

export default function RejectResendForm({ open, onClose, onConfirm, zIndex, loading }) {
  const [notes, setNotes] = useState('')
  const [reasons, setReasons] = useState([])

  const handleReasonToggle = (reason, checked) => {
    if (checked) {
      setReasons([...reasons, reason])
    } else {
      setReasons(reasons.filter((r) => r !== reason))
    }
  }

  const footerActions = (
    <div className="flex w-full gap-3 mt-6 mb-6">
      <MyButton
        expanded
        color="secondary"
        variant="outlined"
        size="lg"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </MyButton>
      <MyButton
        expanded
        color="secondary"
        variant="outlined"
        size="lg"
        onClick={() => onConfirm?.({ reasons, notes })}
        disabled={loading}
        customClassname="!border-brand/300 !text-brand/700 hover:!bg-brand/50"
      >
        {loading ? 'Submitting...' : 'Reject & Resend Form'}
      </MyButton>
    </div>
  )

  return (
    <MyConfirmModalWithChildren
      open={open}
      onClose={onClose}
      zIndex={zIndex}
      forceBlur
      title="Reject Verification & Resend Form"
      message="Select the reason for rejection and add a note so the employee can correct the data and resubmit the form."
      icon={<RefreshCw01 className="text-brand/900" />}
      bgColor="bg-white"
      disableBgPattern
      enableDoubleRing
      footerClassName="!px-0 !mt-0 !mb-0"
      positiveActionWord={footerActions}
    >
      <div className="flex flex-col gap-6">
        {/* Rejection Notes */}
        <MyTextArea
          label={
            <div className="flex items-center gap-1 font-semibold text-gray-700">
              Rejection Notes <span className="text-error/600">*</span>
              <HelpCircle size={16} className="text-gray-400" />
            </div>
          }
          placeholder="Enter a description..."
          helperText="Briefly explain the reason for rejection and the corrections required."
          value={notes}
          onChangeInput={(e) => setNotes(e.target.value)}
          name="rejectionNotes"
        />

        {/* Reasons List */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <MyCheckbox 
              name="reason1" 
              checked={reasons.includes('ktp_unclear')}
              onChangeForm={(e) => handleReasonToggle('ktp_unclear', e.target.checked)}
            />
            <MyChip 
              label="Foto E-KTP tidak jelas atau terpotong" 
              color="gray" 
              variant="filled" 
              size="md" 
              rounded="full" 
            />
          </div>
          <div className="flex items-center gap-3">
            <MyCheckbox 
              name="reason2" 
              checked={reasons.includes('face_verify_failed')}
              onChangeForm={(e) => handleReasonToggle('face_verify_failed', e.target.checked)}
            />
            <MyChip 
              label="Verifikasi wajah gagal" 
              color="gray" 
              variant="filled" 
              size="md" 
              rounded="full" 
            />
          </div>
        </div>
      </div>
    </MyConfirmModalWithChildren>
  )
}
