import SimpleBar from 'simplebar-react'
import { LockUnlocked01, CheckCircle, Minus } from '@untitled-ui/icons-react'
import { MyButton, JpgDefault } from '@interstellar-component'
import { formatFileSize } from '../../../../services/Helper'

function Attachment({ enquiryDetails, setCurrentModal }) {
  const attachments = enquiryDetails?.data?.attachments || {}
  const raw = enquiryDetails?.data?.raw || {}

  return (
    <SimpleBar forceVisible="y" style={{ height: '100%' }}>
      <div className="flex flex-1 flex-col gap-8 pb-8 pt-4">
        <div className="flex flex-col gap-6">
          <div className="flex-col px-4">
            <p className="text-sm-semibold text-gray-light-700">Attachment</p>
          </div>
          <div className="flex flex-1 flex-col px-4 gap-6">
            {Object.entries(attachments).map(([key, item], index) => {
              const isBool = typeof item === 'boolean'
              const isObject = typeof item === 'object' && item !== null && !isBool
              const url = isObject ? item.url : item
              const size = isObject ? item.size : null
              const isImage = typeof url === 'string' && url.length > 0

              return (
                <div
                  key={index}
                  className="flex flex-col gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm-medium text-gray-900">{key}</p>
                    {isBool ? (
                      item ? (
                        <CheckCircle className="size-5 text-success-600" />
                      ) : (
                        <Minus className="size-5 text-gray-400" />
                      )
                    ) : (
                      !isImage && <Minus className="size-5 text-gray-400" />
                    )}
                  </div>
                  {isImage && (
                    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200">
                      <img
                        src={url}
                        alt={key}
                        className="h-[240px] w-full object-cover bg-gray-50"
                      />
                      <div className="flex items-center gap-3 border-t border-gray-200 p-4">
                        <JpgDefault size={40} />
                        <div className="flex flex-col overflow-hidden">
                          <p className="truncate text-sm-medium text-gray-900">
                            {key} - {raw?.name}
                          </p>
                          {size !== null && (
                            <p className="text-sm-regular text-gray-500">{formatFileSize(size)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </SimpleBar>
  )
}

export default Attachment
