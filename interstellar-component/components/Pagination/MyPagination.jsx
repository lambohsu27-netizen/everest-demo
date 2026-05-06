import React from 'react'
import MyButton from '../Button/MyButton'

const MyPagination = ({ meta, onChange }) => {
  const currentPage = parseInt(meta?.current_page, 10) || 1
  const totalPages = Math.max(1, parseInt(meta?.total_page, 10) || 1)

  const goPrev = () => {
    if (currentPage > 1) onChange && onChange(currentPage - 1)
  }
  const goNext = () => {
    if (currentPage < totalPages) onChange && onChange(currentPage + 1)
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
      <span className="text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-3">
        <MyButton
          color="secondary"
          variant="outlined"
          size="sm"
          disabled={currentPage <= 1}
          onClick={goPrev}
        >
          Previous
        </MyButton>
        <MyButton
          color="secondary"
          variant="outlined"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={goNext}
        >
          Next
        </MyButton>
      </div>
    </div>
  )
}

export default MyPagination
