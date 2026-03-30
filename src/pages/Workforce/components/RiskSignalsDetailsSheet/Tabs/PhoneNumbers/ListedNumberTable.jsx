import React from 'react'
import { MyDataTable, MyColumn, MyChip } from '@interstellar-component'

export default function ListedNumberTable({ data, searchTerm }) {
  // Simple filter for the demo
  const filteredData = data.filter((item) =>
    item.number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <MyDataTable values={{ data: filteredData }} className="border-none shadow-none">
      <MyColumn
        header="Phone Number"
        field="number"
        body={(row) => (
          <div className="flex items-center gap-3 py-1">
            <span className="text-sm-semibold text-gray-900">{row.number}</span>
            {row.status === 'Current' && (
              <MyChip label="Current" color="success" variant="filled" size="sm" rounded="full" />
            )}
          </div>
        )}
      />
      <MyColumn
        header="Aging"
        field="aging"
        body={(row) => <span className="text-sm-regular text-gray-600 block py-1">{row.aging}</span>}
      />
      <MyColumn
        header="Last Update Date"
        field="lastUpdate"
        body={(row) => (
          <span className="text-sm-regular text-gray-600 block py-1">{row.lastUpdate}</span>
        )}
      />
    </MyDataTable>
  )
}
