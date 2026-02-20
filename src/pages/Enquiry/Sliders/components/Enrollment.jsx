import { MyButton, MyColumn, MyDataTable } from '@interstellar-component'
import { Plus } from '@untitled-ui/icons-react'
import React from 'react'

const Enrollment = (props) => {
  return (
    <div>
      <div className="flex items-end justify-between px-6 pb-5 pt-5">
        <div>
          <p className="text-lg-semibold text-gray-900">Recent enroll</p>
          <p className="text-sm-regular text-gray-600">
            History enroll nasabah
          </p>
        </div>
        <MyButton variant="filled" size="sm" color="primary">
          <Plus className="size-5 text-gray-light-600" />
          <p className="text-sm-semibold">New enroll</p>
        </MyButton>
      </div>

      <hr className="mx-auto max-w-[330px] pb-6" />

      <MyDataTable values={{ data: [1, 2, 3] }}>
        <MyColumn
          field="date_time"
          header="Date & time"
          body={(value) => (
            <div className="column">
              <p className="text-sm-regular text-gray-light-600">
                {value?.warehouse?.name || '08 Jan 2025'}
              </p>
              <p className="text-sm-regular text-gray-light-600">
                {value?.warehouse?.name || '13:45:24'}
              </p>
            </div>
          )}
        />
        <MyColumn
          field="similarity"
          header="Similarity"
          body={(value) => (
            <p className="text-sm-regular text-gray-light-600">
              {value?.warehouse?.name || '85%'}
            </p>
          )}
        />
        <MyColumn
          field="status"
          header="Status"
          body={(value) => (
            <p className="text-sm-regular text-gray-light-600">
              {value?.warehouse?.name || 'passed'}
            </p>
          )}
        />
      </MyDataTable>
    </div>
  )
}

export default Enrollment
