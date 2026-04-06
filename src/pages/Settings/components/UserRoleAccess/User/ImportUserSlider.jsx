import { useCallback, useState } from 'react'
import SimpleBar from 'simplebar-react'
import {
  XClose,
  DownloadCloud01,
  CheckCircle,
  AlertCircle,
} from '@untitled-ui/icons-react'
import { MyButton, MyDropzone, myToaster } from '@interstellar-component'
import { getCookie } from '@src/services/NetworkUtils'
import { useSettings } from '../../../Context'

const ACCEPT = ['csv', 'xls', 'xlsx']
const MAX_SIZE = 150 * 1024 * 1024 // 150 MB
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function ImportUserSlider() {
  const { closeUserPanel, fetchUsers, downloadUserTemplate } =
    useSettings()

  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [percent, setPercent] = useState(0)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)

  const appendLog = useCallback(
    (log) => setLogs((prev) => [...prev, log]),
    []
  )

  const handleSubmit = async () => {
    if (!files.length) return

    setIsUploading(true)
    setPercent(0)
    setLogs([])
    setResult(null)

    const formData = new FormData()
    formData.append('file', files[0])

    try {
      const response = await fetch(
        `${BASE_URL}/v1/settings/users/import`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getCookie('token-backoffice')}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }
      )

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        throw err || { message: `HTTP ${response.status}` }
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))

            if (event.event === 'progress') {
              setPercent(event.percent ?? 0)
              appendLog({
                row: event.row,
                status: event.status,
                message: event.message ?? '',
              })
            }

            if (event.event === 'result') {
              setResult(event)
              fetchUsers(1, '')
            }
          } catch {
            // skip malformed lines
          }
        }
      }
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
            {!isUploading && !isDone && (
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
                />
              </>
            )}

            {/* Progress section */}
            {(isUploading || isDone) && (
              <div className="flex flex-col gap-4">
                {/* Progress bar */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm-medium text-gray/700">
                      {isDone ? 'Completed' : 'Importing...'}
                    </p>
                    <p className="text-sm-semibold text-gray/900">
                      {Math.round(percent)}%
                    </p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-success/500' : 'bg-brand/600'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Result summary */}
                {isDone && (
                  <div className="flex gap-3">
                    <div className="flex flex-1 items-center gap-2 rounded-lg border border-success/200 bg-success/50 px-3 py-2">
                      <CheckCircle
                        className="size-4 text-success/600"
                        stroke="currentColor"
                      />
                      <p className="text-sm-medium text-success/700">
                        {result.success} success
                      </p>
                    </div>
                    {result.failed_count > 0 && (
                      <div className="flex flex-1 items-center gap-2 rounded-lg border border-error/200 bg-error/50 px-3 py-2">
                        <AlertCircle
                          className="size-4 text-error/600"
                          stroke="currentColor"
                        />
                        <p className="text-sm-medium text-error/700">
                          {result.failed_count} failed
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Row-by-row logs */}
                {logs.length > 0 && (
                  <div className="flex flex-col gap-1 rounded-lg border border-gray-light/200 bg-gray-light/50 p-3">
                    <p className="text-xs-semibold text-gray/700">
                      Import log
                    </p>
                    <div className="flex max-h-[300px] flex-col gap-0.5 overflow-y-auto">
                      {logs.map((log, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2"
                        >
                          {log.status === 'success' ? (
                            <CheckCircle className="mt-0.5 size-3 shrink-0 text-success/500" />
                          ) : (
                            <AlertCircle className="mt-0.5 size-3 shrink-0 text-error/500" />
                          )}
                          <p
                            className={`text-xs-regular ${log.status === 'success' ? 'text-gray/600' : 'text-error/600'}`}
                          >
                            Row {log.row}
                            {log.message ? `: ${log.message}` : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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
