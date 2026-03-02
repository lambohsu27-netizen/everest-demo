import { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { XClose, Edit02 } from '@untitled-ui/icons-react'
import { MyModal, MyButton } from '@interstellar-component'

function SignatureModal({ isOpen, onClose, onSign }) {
  const sigPad = useRef(null)

  const handleSign = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const dataUrl = sigPad.current.toDataURL('image/png')
      onSign(dataUrl)
      onClose()
    } else {
      onClose() // or show error if empty? We just close for now
    }
  }

  return (
    <MyModal open={isOpen} onClose={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-xl outline-none m-4 sm:m-6">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Customer Signature</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50"
          >
            <XClose className="size-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="relative overflow-hidden rounded-xl border border-dashed border-gray-300 bg-white">
          <SignatureCanvas
            ref={sigPad}
            penColor="black"
            canvasProps={{ className: 'w-full h-[300px]' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex shrink-0 justify-between items-center gap-3">
          <MyButton
            type="button"
            variant="outlined"
            color="secondary"
            onClick={onClose}
            className="flex-1 flex items-center justify-center rounded-lg min-h-[44px]"
            size="md"
            expanded
          >
            <span className="text-sm font-semibold text-gray-700">Cancel</span>
          </MyButton>
          <MyButton
            type="button"
            variant="filled"
            color="primary"
            onClick={handleSign}
            className="flex-1 flex items-center justify-center rounded-lg min-h-[44px] gap-2"
            size="md"
            expanded
          >
            <Edit02 className="size-5 text-white" />
            <span className="text-sm font-semibold text-white">Sign</span>
          </MyButton>
        </div>
      </div>
    </MyModal>
  )
}

export default SignatureModal
