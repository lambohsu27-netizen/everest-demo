import React from 'react'
import { ArrowLeft, ArrowRight } from '@untitled-ui/icons-react'

const MyMiniPagination = ({ meta, onChange }) => {
  const handlePrevious = () => {
    if (meta.prev_page) {
      onChange && onChange(meta.prev_page)
    }
  }
  const handleNext = () => {
    if (meta.next_page) {
      onChange && onChange(meta.next_page)
    }
  }

  return (
    <div className="flex w-full items-center justify-between gap-x-3">
      <div className="flex flex-1 justify-start">
        <button
          type="button"
          disabled={!meta?.prev_page}
          onClick={handlePrevious}
          className={`${
            meta?.prev_page
              ? 'border border-gray-light/300 text-gray-light/700 shadow-shadows/shadow-xs'
              : 'border border-gray-light/200 text-gray-light/400'
          } flex items-center gap-x-1.5 rounded-md px-2 py-2`}
        >
          <ArrowLeft className="size-5" stroke={'currentColor'} />
        </button>
      </div>
      <div className="flex items-center justify-center">
        {meta && (
          <p className="text-sm-regular text-gray-light/700">
            {'Page '}
            <span className="text-sm-medium">{meta?.current_page}</span>
            {' of '}
            <span className="text-sm-medium">{meta?.total_page}</span>
          </p>
        )}
      </div>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          disabled={!(meta?.next_page && meta?.next_page <= meta?.total_page)}
          onClick={handleNext}
          className={`${
            meta?.next_page && meta?.next_page <= meta?.total_page
              ? 'border border-gray-light/300 text-gray-light/700 shadow-shadows/shadow-xs'
              : 'border border-gray-light/200 text-gray-light/400'
          } flex items-center gap-x-1.5 rounded-md px-2 py-2`}
        >
          <ArrowRight className="size-5" stroke={'currentColor'} />
        </button>
      </div>
    </div>
  )
}

export default MyMiniPagination
