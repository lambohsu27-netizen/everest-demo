// Libraries
import React from 'react'
import moment from 'moment'
import SimpleBar from 'simplebar-react'
import {
  MyAvatar,
  MyButton,
  MyChip,
  MyDetailView,
} from '@interstellar-component'
import { Edit04 } from '@untitled-ui/icons-react'

const General = ({ nasabahDetails }) => {
  return (
    <>
      <SimpleBar forceVisible="y" style={{ height: '89%' }}>
        <div className="flex flex-col gap-8 py-6">
          <div className="flex flex-col gap-6">
            {/* SECTION 1 */}
            <div className="w-max-[280px] flex w-full flex-col gap-1 px-4">
              <p className="text-sm-semibold text-gray-light-700">
                Nasabah information
              </p>
            </div>
            <div className="flex flex-1 flex-col">
              <MyDetailView
                datas={nasabahDetails?.data ? nasabahDetails?.data : {}}
              />
            </div>
          </div>
        </div>
      </SimpleBar>
      <footer className="flex items-center justify-end gap-4 border-t border-gray-light-200 px-4 py-4">
        <div>
          <MyButton
            type={'reset'}
            variant={''}
            size={'md'}
            // onClick={() => {
            //   deleteNasabah(currentSlider.id)
            //   handleCurrentSlider(null)
            // }}
          >
            <p className="text-sm-semibold text-error-700">Delete</p>
          </MyButton>
        </div>
        <div>
          <MyButton
            color={'secondary'}
            variant={'outlined'}
            size={'md'}
            // onClick={() => {
            //   handleCurrentSlider(
            //     {
            //       status: true,
            //       current: 'user',
            //     },
            //     currentSlider.id
            //   )
            // }}
          >
            <Edit04 className={'size-5 text-gray-light-600'} />
            <p className="text-sm-semibold">Edit</p>
          </MyButton>
        </div>
      </footer>
    </>
  )
}

export default General
