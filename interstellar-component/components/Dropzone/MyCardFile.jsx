/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react'
import { Trash01 } from '@untitled-ui/icons-react'
import {
  CsvDefault,
  GifDefault,
  JpgDefault,
  PdfDefault,
  PngDefault,
  XlsDefault,
  XlsxDefault,
} from '../Icon/Extension'
import { formatFileSize } from '../../../src/services/Helper'
import MyButtonIcon from '../Button/MyButtonIcon'

function MyCardFile({
  progressUpload,
  file,
  onDeleteFile,
  progress = 0,
  showImage = true,
}) {
  const [blob, setBlob] = useState(null)
  const [blob2, setBlob2] = useState(null)

  useEffect(() => {
    if (file) {
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'
      ) {
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            const blob = new Blob([reader.result], { type: file.type })
            const url = URL.createObjectURL(blob)
            console.log(url)
            setBlob(url)

            // handle if showImage = false
            const readerBase64 = new FileReader()
            readerBase64.onload = () => {
              const base64String = readerBase64.result
              setBlob2(base64String.substr(base64String.indexOf(', ') + 1))
            }
            readerBase64.readAsDataURL(blob)
          }
          reader.readAsArrayBuffer(file)
        }
      }
    }
  }, [file])

  const handleFileClick = () => {
    // Function to generate the new download filename
    const getDownloadName = (name) => {
      const dotIndex = name.lastIndexOf('.')
      return dotIndex !== -1
        ? `${name.slice(0, dotIndex)}_download${name.slice(dotIndex)}`
        : `${name}_download`
    }

    // For CSV and Excel files, use the file object directly
    if (
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      const url = URL.createObjectURL(file)
      const a = document.createElement('a')
      a.href = url
      a.download = getDownloadName(file.name)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (blob2) {
      // For image files or other types using blob2
      const byteCharacters = atob(blob2.split(', ')[1])
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blobObj = new Blob([byteArray], { type: file.type })
      const url = URL.createObjectURL(blobObj)
      const a = document.createElement('a')
      a.href = url
      a.download = getDownloadName(file.name)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  function IconExtension() {
    const fileType = file.type
    switch (fileType) {
      case 'image/jpeg':
        return <JpgDefault size={40} />
      case 'image/png':
        return <PngDefault size={40} />
      case 'image/gif':
        return <GifDefault size={40} />
      case 'application/pdf':
        return <PdfDefault size={40} />
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <XlsxDefault size={40} />
      case 'application/vnd.ms-excel':
        return <XlsDefault size={40} />
      case 'text/csv':
        return <CsvDefault size={40} />
      default:
        return <></>
    }
  }

  // console.log("progressUpload", progressUpload, progress);
  return (
    <section className="relative w-full overflow-hidden rounded-lg border border-gray-light/200 p-4">
      <div
        className="flex w-full cursor-pointer items-start gap-3"
        // onClick={() => {
        //   if (blob2) {
        //     const byteCharacters = atob(blob2.split(',')[1])
        //     const byteNumbers = new Array(byteCharacters.length)
        //     for (let i = 0; i < byteCharacters.length; i++) {
        //       byteNumbers[i] = byteCharacters.charCodeAt(i)
        //     }
        //     const byteArray = new Uint8Array(byteNumbers)
        //     const blob = new Blob([byteArray], { type: file.type })
        //     const url = URL.createObjectURL(blob)
        //     window.open(url)
        //   }
        // }}
        onClick={handleFileClick}
      >
        <div className="h-10 min-h-[40px] w-10 min-w-[40px]">
          <IconExtension />
        </div>
        <div className="flex flex-1 flex-col gap-1 overflow-hidden">
          <div className="flex flex-col overflow-hidden pr-8">
            <p className="text-sm-medium line-clamp-1 break-all text-gray-light/700">
              {file.name}
            </p>
            <p className="text-sm-regular text-gray-light/600">
              {formatFileSize(file.size)}
            </p>
          </div>
          <div
            className={
              'flex items-center gap-3 ' +
              `${progress || progress === 0 ? '' : 'invisible'}`
            }
          >
            <div className="flex-1">
              {progressUpload && progressUpload.import ? (
                <div
                  className="h-2 rounded-full bg-success/600 duration-300"
                  style={{ width: `${progress}%` }}
                />
              ) : (
                <div
                  className="h-2 rounded-full bg-brand/900 duration-300"
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>
            <p className="text-sm-medium text-gray-light/700">{progress}%</p>
          </div>
          {showImage && blob && (
            <div className="flex w-full items-center justify-center overflow-hidden rounded-lg">
              <img className="h-full w-full object-contain" src={blob} alt="" />
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-2 top-2">
        <MyButtonIcon
          disabled={progress < 100 && progress > 0}
          onClick={onDeleteFile}
          color="gray"
          variant="text"
          size="md"
        >
          <Trash01
            className="size-5 text-gray-light/600"
            stroke="currentColor"
          />
        </MyButtonIcon>
      </div>
    </section>
  )
}

export default MyCardFile
