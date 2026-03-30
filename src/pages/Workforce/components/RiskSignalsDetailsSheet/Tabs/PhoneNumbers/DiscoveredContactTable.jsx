import React from 'react'
import { MyDataTable, MyColumn, MyChip } from '@interstellar-component'

export default function DiscoveredContactTable({ data, searchTerm }) {
  // Simple filter for the demo
  const filteredData = data.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <MyDataTable values={{ data: filteredData }} className="border-none shadow-none">
      <MyColumn
        header="Labels"
        field="label"
        body={(row) => <span className="text-sm-semibold text-gray-900 block py-1">{row.label}</span>}
      />
      <MyColumn
        header="Count"
        field="count"
        body={(row) => <span className="text-sm-regular text-gray-600 block py-1">{row.count}</span>}
      />
      <MyColumn
        header="Associated Number"
        field="numbers"
        body={(row) => (
          <div className="flex items-center gap-2 py-1 flex-wrap">
            {row.numbers.map((num, idx) => (
              <MyChip
                key={idx}
                label={num}
                color="brand"
                variant="outlined"
                size="sm"
                rounded="full"
              />
            ))}
            {row.extra && (
              <span className="text-xs text-gray-500 ml-1 font-medium">+{row.extra}</span>
            )}
          </div>
        )}
      />
    </MyDataTable>
  )
}
