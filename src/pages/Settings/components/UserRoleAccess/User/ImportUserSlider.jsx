import { useCallback, useState } from 'react'
import SimpleBar from 'simplebar-react'
import {
  XClose,
  DownloadCloud01,
  CheckCircle,
  AlertCircle,
} from '@untitled-ui/icons-react'
import { MyButton, MyDropzone, myToaster } from '@interstellar-component'
import { postSSE } from '@src/services/NetworkUtils'
import { useSettings } from '../../../Context'

const ACCEPT = ['csv', 'xls', 'xlsx']
const MAX_SIZE = 150 * 1024 * 1024 // 150 MB

export default function ImportUserSlider() {
  const { closeUserPanel, fetchUsers, downloadUserTemplate } =
    useSettings()

  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [progressUpload, setProgressUpload] = useState({ progress: 0, import: false })
  const [result, setResult] = useState(null)
  const [failedFile, setFailedFile] = useState(null)

  const handleSubmit = async () => {
    if (!files.length) return

    setIsUploading(true)
    setProgressUpload({ progress: 0, import: false })
    setFailedFile(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', files[0])
    try {
      await postSSE(
        '/v1/settings/users/import',
        formData,
        (event) => {
          if (event.event === 'progress') {
            setProgressUpload({ progress: parseFloat(event.progress ?? "0"), import: true })
          }

          if (event.event === 'result') {
            setResult(event)
            fetchUsers(1, '')
            setFailedFile({
              failed: event.failed,
              success: event.success,
            })
          }
        },
        {
          onUploadProgress: (e) => {
            const progress = e.total ? e.loaded / e.total : 0
            setProgressUpload({ progress, import: false })
          },
        }
      )
    } catch (err) {
      myToaster(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) closeUserPanel()
  }

  const isDone = result !== null

  console.log('progressUpload: ', progressUpload)

  return (
    <div className="flex h-screen w-[480px] flex-col">
      {/* Header */}
      <header className="relative flex items-start gap-x-4 border-b border-gray-light/200 px-6 py-6">
        <button
          type="button"
          onClick={handleClose}
          disabled={isUploading}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg p-2 text-gray-light/400 hover:bg-gray-light/50 disabled:opacity-50"
        >
          <XClose size={24} stroke="currentColor" />
        </button>
        <div className="flex flex-1 flex-col gap-1 pt-1">
          <p className="text-lg-semibold text-gray/900">
            Import users
          </p>
          <p className="text-sm-regular text-gray/600">
            {isDone
              ? 'Import completed.'
              : 'Choose or drag the file you want to upload.'}
          </p>
        </div>
      </header>

      {/* Body */}
      <section className="flex-1 overflow-hidden">
        <SimpleBar forceVisible="y" style={{ maxHeight: '100%' }}>
          <div className="flex flex-col gap-6 px-6 py-6">
            {/* Upload section — hidden once uploading/done */}

            <>
              <MyButton
                type="button"
                color="secondary"
                variant="outlined"
                size="md"
                onClick={downloadUserTemplate}
              >
                <DownloadCloud01 className="size-4" />
                <p className="text-sm-semibold">
                  Download Template
                </p>
              </MyButton>

              <MyDropzone
                accept={ACCEPT}
                maxSize={MAX_SIZE}
                onChange={setFiles}
                progressUpload={progressUpload}
                failedFile={failedFile}
              />
            </>
          </div>
        </SimpleBar>
      </section>

      {/* Footer */}
      <footer className="flex items-center justify-end gap-3 border-t border-gray-light/200 px-6 py-4">
        {isDone ? (
          <MyButton
            type="button"
            color="primary"
            variant="filled"
            size="md"
            onClick={closeUserPanel}
          >
            <p className="text-sm-semibold">Done</p>
          </MyButton>
        ) : (
          <>
            <MyButton
              type="button"
              color="secondary"
              variant="outlined"
              size="md"
              disabled={isUploading}
              onClick={handleClose}
            >
              <p className="text-sm-semibold">Cancel</p>
            </MyButton>
            <MyButton
              type="button"
              color="primary"
              variant="filled"
              size="md"
              disabled={isUploading || files.length === 0}
              onClick={handleSubmit}
            >
              <p className="text-sm-semibold">
                {isUploading ? 'Uploading...' : 'Submit'}
              </p>
            </MyButton>
          </>
        )}
      </footer>
    </div>
  )
}
