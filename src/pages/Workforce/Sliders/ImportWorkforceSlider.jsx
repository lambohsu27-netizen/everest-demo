// Libraries
import { useState } from 'react'
import SimpleBar from 'simplebar-react'
// UI Icons
import { XClose, DownloadCloud01 } from '@untitled-ui/icons-react'
// Shared Components
import { MyButton, MyDropzone } from '@interstellar-component'
// Context
import { useWorkforce } from '../Context'

// ── Accepted file types ────────────────────────────────────────────────────────
const ACCEPT = ['csv', 'xls', 'xlsx']
const MAX_SIZE = 150 * 1024 * 1024 // 150 MB

// ── Main component ─────────────────────────────────────────────────────────────
function ImportWorkforceSlider() {
  const { handleCurrentSlider } = useWorkforce()
  const [files, setFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => handleCurrentSlider(null)

  const handleSubmit = async () => {
    if (!files.length) return
    setIsSubmitting(true)
    try {
      // TODO: wire to real upload API
    } finally {
      setIsSubmitting(false)
      handleClose()
    }
  }

  const handleDownloadTemplate = () => {
    // TODO: replace with real template URL
    const link = document.createElement('a')
    link.href = '/templates/workforce-template.xlsx'
    link.download = 'workforce-template.xlsx'
    link.click()
  }

  return (
    <div className="flex h-screen w-[420px] flex-col">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="relative flex items-start gap-x-4 px-6 py-6 border-b border-gray/100">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[12px] top-[12px] flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-light/50 active:bg-gray-light/100"
        >
          <XClose size={24} stroke="currentColor" />
        </button>



        {/* Title + subtitle */}
        <div className="flex flex-1 flex-col gap-1 pt-1">
          <p className="text-lg-semibold text-gray/900">Upload workforce</p>
          <p className="text-sm-regular text-gray/600">
            Choose or drag the file you want to upload.
          </p>
        </div>
      </header>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <section className="flex-1 overflow-hidden">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col gap-6 px-6 py-6">

            {/* Download template */}
            <MyButton
              type="button"
              color="secondary"
              variant="outlined"
              size="md"
              onClick={handleDownloadTemplate}
            >
              <DownloadCloud01 className="size-4" />
              <p className="text-sm-semibold">Download Template</p>
            </MyButton>

            {/* Dropzone */}
            <MyDropzone
              accept={ACCEPT}
              maxSize={MAX_SIZE}
              onChange={setFiles}
            />

          </div>
        </SimpleBar>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-end gap-3 border-t border-gray/200 px-6 py-4">
        <MyButton
          type="button"
          color="secondary"
          variant="outlined"
          size="md"
          onClick={handleClose}
        >
          <p className="text-sm-semibold">Cancel</p>
        </MyButton>

        <MyButton
          type="button"
          color="primary"
          variant="filled"
          size="md"
          disabled={isSubmitting || files.length === 0}
          onClick={handleSubmit}
        >
          <p className="text-sm-semibold">Submit</p>
        </MyButton>
      </footer>
    </div>
  )
}

export default ImportWorkforceSlider
