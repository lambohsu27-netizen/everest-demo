import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'

export default function MobileSignature() {
  const { roomId } = useParams()
  const sigPad = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)

  const handleClear = () => {
    if (sigPad.current) {
      sigPad.current.clear()
    }
  }

  const handleSign = async () => {
    if (sigPad.current && sigPad.current.isEmpty()) {
      setErrorVisible(true)
      return
    }

    setErrorVisible(false)
    setIsSubmitting(true)
    const dataUrl = sigPad.current.toDataURL('image/png')

    try {
      let baseURL = import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace('/backoffice', '')
        : 'http://localhost:4000'

      if (baseURL.includes('localhost')) {
        baseURL = baseURL.replace('localhost', window.location.hostname)
      }
      const response = await fetch(`${baseURL}/api/upload-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          signature: dataUrl,
        }),
      })
      console.log('response', response)

      if (response.ok) {
        setSuccess(true)
      } else {
        alert('Failed to submit signature.')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to submit signature.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 flex h-[100dvh] w-full flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center">
        <h2 className="text-2xl font-semibold text-green-600">Success!</h2>
        <p className="text-gray-600">
          Your signature has been sent to the main application. You can close this page.
        </p>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex h-[100dvh] w-full flex-col bg-gray-50 p-4">
      <div className="mb-4 mt-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Customer Signature</h1>
        <p className="text-sm text-gray-600">Please sign in the box below</p>
      </div>

      {errorVisible && (
        <p className="mb-2 text-center text-sm font-medium text-error-600">
          Please provide a signature before submitting.
        </p>
      )}

      <div className="relative mb-6 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <SignatureCanvas
          ref={sigPad}
          penColor="black"
          canvasProps={{ className: 'w-full h-full' }}
          clearOnResize={false}
        />
      </div>

      <div className="mb-6 flex gap-4">
        <button
          className="flex-1 rounded-lg border border-gray-300 bg-white py-3 text-sm-medium text-gray-700 shadow-sm hover:bg-gray-50"
          onClick={handleClear}
          disabled={isSubmitting}
        >
          Clear
        </button>
        <button
          className="flex-1 rounded-lg bg-brand-600 py-3 text-sm-medium text-white shadow-sm bg-brand/700"
          onClick={handleSign}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Sign'}
        </button>
      </div>
    </div>
  )
}
