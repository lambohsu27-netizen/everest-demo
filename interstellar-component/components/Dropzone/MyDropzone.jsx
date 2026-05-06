/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useMemo, useState } from 'react'
import Dropzone from 'react-dropzone'
import { DownloadCloud01, UploadCloud02 } from '@untitled-ui/icons-react'
import Papa from 'papaparse'
import socketio from 'socket.io-client'
import * as XLSX from 'xlsx'
import { set } from 'lodash'
import {
  convertToMimeDict,
  formatFileExtensions,
  formatFileSize,
} from '../../../src/services/Helper'
import MyCardFile from './MyCardFile'
import MyButton from '../Button/MyButton'

// Common MIME types
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

function MyDropzone({
  colorBg,
  maxSize,
  accept,
  progressUpload,
  multiple = false,
  onChange,
  onDrop,
  onDropAccepted,
  onDropRejected,
  failedFile,
  errors,
  showImage,
  isSmallSize = false,
}) {
  const [socket, setSocket] = useState(null)
  const [files, setFiles] = useState([])
  const [failedFiles, setFailedFiles] = useState(null)
  // const [progress, setProgress] = useState([]);

  const sanitizeExcel = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName]
          // Iterate over each cell in the sheet
          for (const cell in sheet) {
            if (cell[0] === '!') continue // Skip metadata keys
            // If cell contains a formula, convert the formula to a string
            if (sheet[cell].f !== undefined) {
              // sheet[cell].v = String(sheet[cell].f)
              delete sheet[cell].f
            } else if (sheet[cell].v !== undefined) {
              sheet[cell].v = String(sheet[cell].v)
            }
          }
        })
        // Write the workbook back to an ArrayBuffer
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        // Create a new File from the sanitized data (keep the same name and type)
        const newFile = new File([wbout], file.name, { type: file.type })
        resolve(newFile)
      }
      reader.onerror = (err) => {
        reject(err)
      }
      reader.readAsArrayBuffer(file)
    })

  const processAcceptedFiles = async (acceptedFilesToProcess) => {
    const processed = await Promise.all(
      acceptedFilesToProcess.map((file) => {
        if (
          file.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel'
        ) {
          return sanitizeExcel(file)
        }
        return file
      })
    )
    return processed
  }

  const handleDrop = async (acceptedFiles, rejectedFiles, e) => {
    // Process files before adding to state or calling callbacks
    const processedFiles = await processAcceptedFiles(acceptedFiles)
    const _files = [...files, ...processedFiles]
    setFiles(_files)
    onChange && onChange(_files)
    onDrop && onDrop(processedFiles, rejectedFiles, e)
  }

  const handleDropAccepted = (acceptedFiles) => {
    onDropAccepted && onDropAccepted(acceptedFiles, handleDeleteFile)
  }

  useEffect(() => {
    setFailedFiles(failedFile)
  }, [failedFile])

  const handleDeleteFile = (file) => {
    const _files = [...files]
    _files.splice(_files.indexOf(file), 1)

    setFiles(_files)
    onChange && onChange(_files)
    setFailedFiles(null)
  }

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(failedFiles?.failed)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    // let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    // XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    // Remove hidden rows or columns if any
    delete worksheet['!rows']
    delete worksheet['!cols']

    // Clean any custom properties or metadata
    workbook.Props = {}
    workbook.Custprops = {}
    XLSX.writeFile(workbook, 'downloaded-file.xlsx', { compression: true })
    // const url = window.URL.createObjectURL(
    //   new Blob([Papa.unparse(failedFile?.failed)])
    // );
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = "" || "downloaded-file.csv";
    // document.body.appendChild(link);

    // link.click();

    // document.body.removeChild(link);
    // window.URL.revokeObjectURL(url);
  }
  // useEffect(() => {
  //   const socket = socketio.connect(baseURL + "/v1", {
  //     transports: ["websocket"],
  //     upgrade: false,
  //   });
  //   setSocket(socket);
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // console.log('progressUpload', progressUpload)
  const progressList = useMemo(() => {
    if (files.length && progressUpload && typeof progressUpload.progress === 'number') {
      const maxValue = 1 / files.length
      let { progress } = progressUpload

      const lprogress = []
      for (let i = 0; i < files.length; i++) {
        if (progress > maxValue) {
          lprogress.push(100)
          progress -= maxValue
        } else {
          const value = Math.min(progress, maxValue)
          lprogress.push(Math.floor((value / maxValue) * 100))
          progress = 0
        }
      }

      return lprogress
    }
    return files.map((e) => 0)
  }, [progressUpload, files])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        {(multiple || files.length === 0) && (
          <Dropzone
            multiple={multiple}
            maxSize={maxSize}
            accept={convertToMimeDict(accept)}
            onDrop={handleDrop}
            onDropAccepted={handleDropAccepted}
            onDropRejected={onDropRejected}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragReject,
              rejectedFiles,
            }) => (
              <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <section
                  className={`${
                    isDragReject
                      ? 'cursor-not-allowed border-2 border-error/600'
                      : isDragActive
                        ? 'cursor-pointer border-2 border-brand/900'
                        : 'cursor-pointer border border-gray-light/200'
                  } flex w-full flex-col items-center gap-y-3 rounded-xl px-6 py-4 ${colorBg || ''} `}
                >
                  <div className="block w-max rounded-lg border border-gray-light/200 p-2.5 shadow-shadows/shadow-xs">
                    <UploadCloud02
                      className="size-5 text-gray-light/700"
                      stroke="currentColor"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <div
                      className={` ${isSmallSize ? 'flex-col' : 'flex'} items-center gap-1.5`}
                    >
                      <p
                        className={`text-sm-semibold ${
                          isDragReject ? 'text-error/700' : 'text-brand/700'
                        }`}
                      >
                        Click to upload
                      </p>
                      <p className="text-sm-regular text-gray-light/600">
                        or drag and drop
                      </p>
                    </div>
                    <p
                      className={`text-xs-regular ${isSmallSize ? 'flex-col' : 'flex'} gap-1 text-gray-light/600`}
                    >
                      {accept && <span>{formatFileExtensions(accept)}</span>}
                      {maxSize && <span>(max. {formatFileSize(maxSize)})</span>}
                    </p>
                  </div>
                </section>
              </div>
            )}
          </Dropzone>
        )}
        {errors && files.length === 0 && (
          <p className="text-sm-medium text-error/600">{errors}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {files &&
          files.map((file, i) => (
            <MyCardFile
              key={i}
              progressUpload={progressUpload}
              progress={progressList[i]}
              onDeleteFile={() => {
                handleDeleteFile(file)
              }}
              file={file}
              showImage={showImage}
            />
          ))}
      </div>
      {failedFiles && (
        <div className="rounded-lg border border-gray-light/200">
          <div className="flex items-start gap-3 rounded-t-lg bg-gray-light/50 px-4 py-4">
            <p className="text-sm-medium flex-1 text-gray-light/900">
              Total data
            </p>
            <p className="text-sm-regular text-right text-gray-light/600">
              {(failedFiles?.success || 0) + (failedFiles?.failed?.length || 0)}
            </p>
          </div>
          <div className="flex items-start gap-3 px-4 py-4">
            <p className="text-sm-medium flex-1 text-gray-light/900">Success</p>
            <p className="text-sm-regular text-right text-gray-light/600">
              {failedFiles?.success ?? 0}
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-b-lg bg-gray-light/50 px-4 py-4">
            <p className="text-sm-medium flex-1 text-gray-light/900">Failed</p>
            <p className="text-sm-regular text-right text-gray-light/600">
              {failedFiles?.failed?.length ?? 0}
            </p>
          </div>
          {failedFiles?.failed?.length ? (
            <div className="flex justify-end gap-3 px-1 py-4">
              <MyButton
                onClick={handleDownload}
                size="sm"
                children={
                  <div className="flex items-center gap-1.5">
                    <DownloadCloud01 stroke="currentColor" />
                    <p className="text-sm-semibold">Download failed data</p>
                  </div>
                }
                color="primary"
                variant="text"
              />
            </div>
          ) : (
            null
          )}
        </div>
      )}
    </div>
  )
}

export default MyDropzone
