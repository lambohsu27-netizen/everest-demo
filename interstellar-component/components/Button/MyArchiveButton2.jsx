import { MyPopper } from '@interstellar-component'
import { Activity, Archive } from '@untitled-ui/icons-react'

function MyArchiveButton2({ target, data, setParams }) {
  return (
    <MyPopper target={target} placement="bottom-end">
      {(open, anchorEl, handleOpen, handleClose) => (
        <div className="flex h-max w-max flex-col">
          <button
            onClick={() => {
              setParams((value) => ({
                ...value,
                archive: 0,
                page: 1,
              }))
              handleClose()
            }}
            className="py flex items-center px-1.5 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3 px-2.5 py-[9px] text-gray-light/700">
              <Activity className="size-4" stroke="currentColor" />
              <p className="text-sm-semibold">View active</p>
            </div>
          </button>
          <hr className="border-gray-light/200" />
          <button
            onClick={() => {
              setParams((value) => ({
                ...value,
                archive: 1,
                page: 1,
              }))
              handleClose()
            }}
            className="py flex items-center px-1.5 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3 px-2.5 py-[9px] text-gray-light/700">
              <Archive className="size-4" stroke="currentColor" />
              <p className="text-sm-semibold">View archive</p>
            </div>
          </button>
        </div>
      )}
    </MyPopper>
  )
}

export default MyArchiveButton2
