import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { XCircle } from '@untitled-ui/icons-react'
import {
  MyButton,
  MyFeaturedIconV2,
  myToaster,
  MyConfirmModalWithChildren,
} from '@interstellar-component'
import RejectResendForm from './RejectResendForm'
import Service from '../service'

export default function VerificationOCRModal({
  open,
  data,
  enquiryId,
  onActionComplete,
  onSubmitNext,
}) {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [canceling, setCanceling] = useState(false)

  if (!open) return null

  const displayData = data || {
    portrait:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=640&h=800&auto=format&fit=crop',
    ktp: 'https://images.unsplash.com/photo-1594819047050-99defca82545?q=80&w=800&h=500&auto=format&fit=crop',
    score: 63,
  }

  const handleCancel = async () => {
    if (!enquiryId) return
    setCanceling(true)
    try {
      const res = await Service.cancel(enquiryId)
      myToaster(res)
      setIsCancelOpen(false)
      onActionComplete?.()
    } catch (err) {
      myToaster(err)
    } finally {
      setCanceling(false)
    }
  }

  const handleReject = async ({ reasons, notes }) => {
    if (!enquiryId) return
    if (!reasons?.length || !notes?.trim()) {
      myToaster({ message: 'Select at least one reason and add notes.', type: 'error' })
      return
    }
    setRejecting(true)
    try {
      const res = await Service.reject(enquiryId, { reasons, notes })
      myToaster(res)
      setIsRejectModalOpen(false)
      onActionComplete?.()
    } catch (err) {
      myToaster(err)
    } finally {
      setRejecting(false)
    }
  }

  const handleSubmit = async () => {
    if (!enquiryId) return
    setSubmitting(true)
    try {
      const res = await Service.submit(enquiryId)
      myToaster(res)
      onSubmitNext?.(res?.data?.next || null)
      onActionComplete?.()
    } catch (err) {
      myToaster(err)
    } finally {
      setSubmitting(false)
    }
  }

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed right-[440px] top-6 bottom-6 z-[2000] flex w-[calc(100vw-440px-48px)] max-w-[886px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl border border-gray-100 antialiased"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -left-20 -top-20 opacity-5 pointer-events-none text-gray-200 z-0">
        <svg width="336" height="336" viewBox="0 0 336 336" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="168" cy="168" r="48" stroke="currentColor" />
          <circle cx="168" cy="168" r="72" stroke="currentColor" />
          <circle cx="168" cy="168" r="96" stroke="currentColor" />
          <circle cx="168" cy="168" r="120" stroke="currentColor" />
          <circle cx="168" cy="168" r="144" stroke="currentColor" />
          <circle cx="168" cy="168" r="168" stroke="currentColor" />
        </svg>
      </div>

      <header className="relative flex w-full flex-col gap-4 p-6 shrink-0 border-b border-gray-100 bg-white z-10">
        <div className="flex flex-col gap-4">
          <MyFeaturedIconV2 icon="CheckVerified01" color="Brand" size="lg" />
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold text-gray-900">Admin verification</h3>
            <p className="text-sm text-gray-500">
              Match the E-KTP OCR results with the registered employee data to ensure identity matches.
            </p>
          </div>
        </div>
      </header>

      <section
        className="flex-1 flex flex-col gap-5 p-6 overflow-y-auto custom-scrollbar min-h-0 bg-white"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#D0D5DD transparent' }}
      >
        <div className="flex flex-wrap h-fit w-full gap-8">
          <div className="flex min-w-[200px] flex-1 max-w-[261px] shrink-0 overflow-hidden rounded-3xl border border-gray-100 shadow-sm aspect-[261/353]">
            <img
              src={displayData.portrait}
              alt="Portrait of the employee"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-[2] min-w-[300px] overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center aspect-[545/353]">
            <img
              src={displayData.ktp}
              alt="Scan of the employee ID card (KTP)"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-4 rounded-xl border border-brand/100 bg-[#FCFAFF] p-4 shrink-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/900 text-[10px] font-semibold text-white">
            {displayData.score}%
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-brand/700">Face Match Score</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white border border-brand/100">
              <div
                className="h-full rounded-full bg-brand/900 transition-all duration-500"
                style={{ width: `${displayData.score}%` }}
                role="progressbar"
                aria-valuenow={displayData.score}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="flex items-center justify-between border-t border-gray-100 p-6 shrink-0 bg-white z-10">
        <MyButton
          color="error"
          variant="link"
          size="md"
          customClassname="gap-2 px-0"
          onClick={() => setIsCancelOpen(true)}
          disabled={canceling || submitting || rejecting}
        >
          <XCircle size={20} className="text-error/700" />
          Cancel request
        </MyButton>

        <div className="flex items-center gap-3">
          <MyButton
            color="secondary"
            variant="outlined"
            size="lg"
            customClassname="px-6"
            onClick={() => setIsRejectModalOpen(true)}
            disabled={submitting || canceling}
          >
            Reject & resend form
          </MyButton>
          <MyButton
            color="primary"
            variant="filled"
            size="lg"
            customClassname="px-6"
            onClick={handleSubmit}
            disabled={submitting || canceling || rejecting}
          >
            {submitting ? 'Submitting...' : 'Submit application & view next'}
          </MyButton>
        </div>
      </footer>

      <RejectResendForm
        open={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        zIndex={3000}
        loading={rejecting}
        onConfirm={handleReject}
      />

      <MyConfirmModalWithChildren
        open={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancel request"
        message="Are you sure you want to cancel this enquiry request? This action cannot be undone."
        icon={<XCircle className="text-error/700" />}
        bgColor="bg-error/100"
        forceBlur
        negativeActionWord="Back"
        positiveActionWord={canceling ? 'Canceling...' : 'Cancel request'}
        positiveButtonColor="error"
        zIndex={3500}
      />

    </div>,
    document.body
  )
}
