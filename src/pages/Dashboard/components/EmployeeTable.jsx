import { MyColumn, MyDataTable } from '@interstellar-component'
import React, { useState } from 'react'

const MOCK_DATA = [
  {
    id: 1,
    name: 'Lily-Rose Chedjou',
    role: 'ID-00192 • Product Design',
    level: 'Manager',
    kolektibilitas: 'KOL 1',
    creditScore: '720',
    footprint: '2',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 16, 2025',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
  {
    id: 2,
    name: 'Caitlyn King',
    role: 'ID-00192 • Product Design',
    level: 'Senior Manager',
    kolektibilitas: 'KOL 1',
    creditScore: '720',
    footprint: '4',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 16, 2025',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: 3,
    name: 'Fleur Cook',
    role: 'ID-00192 • Product Design',
    level: 'Senior Manager',
    kolektibilitas: 'KOL 2',
    creditScore: '720',
    footprint: '0',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 15, 2025',
    avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
  },
  {
    id: 4,
    name: 'Marco Kelly',
    role: 'ID-00192 • Product Design',
    level: 'Senior Manager',
    kolektibilitas: 'KOL 3',
    creditScore: '720',
    footprint: '0',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 14, 2025',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 5,
    name: 'Lulu Meyers',
    role: 'ID-00192 • Product Design',
    level: 'Manager',
    kolektibilitas: 'KOL 5',
    creditScore: '720',
    footprint: '2',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 14, 2025',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 6,
    name: 'Mikey Lawrence',
    role: 'ID-00192 • Product Design',
    level: 'Manager',
    kolektibilitas: 'KOL 5',
    creditScore: '720',
    footprint: '3',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 14, 2025',
    avatar: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: 7,
    name: 'Freya Browning',
    role: 'ID-00192 • Product Design',
    level: 'Manager',
    kolektibilitas: 'KOL 1',
    creditScore: '720',
    footprint: '2',
    outstanding: 'Rp20.000.000',
    dataAs: 'Jan 14, 2025',
    avatar: 'https://i.pravatar.cc/150?img=14',
  },
]

function getBadgeColor(kol) {
  switch (kol) {
    case 'KOL 1':
      return 'bg-success/50 text-success/700 border border-success/200'
    case 'KOL 2':
      return 'bg-warning/50 text-warning/700 border border-warning/200'
    case 'KOL 3':
      return 'bg-warning/100 text-warning/800 border border-warning/300'
    case 'KOL 4':
      return 'bg-error/50 text-error/700 border border-error/200'
    case 'KOL 5':
      return 'bg-error/100 text-error/800 border border-error/300'
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

function EmployeeTable() {
  const [data, setData] = useState(MOCK_DATA)
  const [sortField, setSortField] = useState(null)
  const [sortOrder, setSortOrder] = useState(null)

  const handleSort = ({ sort, order }) => {
    setSortField(sort)
    setSortOrder(order)

    if (!sort || !order) {
      setData(MOCK_DATA)
      return
    }

    const sortedData = [...data].sort((a, b) => {
      let valA = a[sort] || ''
      let valB = b[sort] || ''

      // Handle numeric sorting for relevant fields
      if (['creditScore', 'footprint'].includes(sort)) {
        valA = Number(valA)
        valB = Number(valB)
      }

      // Handle currency sorting for Outstanding
      if (sort === 'outstanding') {
        valA = Number(valA.replace(/[^0-9.-]+/g, ''))
        valB = Number(valB.replace(/[^0-9.-]+/g, ''))
      }

      if (valA < valB) return order === 'asc' ? -1 : 1
      if (valA > valB) return order === 'asc' ? 1 : -1
      return 0
    })

    setData(sortedData)
  }

  const handleSelectionChange = (updated) => {
    setData(updated.data)
  }

  const values = {
    data,
    meta: {
      current_page: 1,
      next_page: 2,
      per_page: 10,
      total: 100,
    },
    checkedAll: data.every((d) => d.checked),
  }

  return (
    <div className="px-8 pb-8">
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <MyDataTable
          values={values}
          selectionMode="multiple"
          onSelectionChange={handleSelectionChange}
          paginator
          currentSortFieldFromParams={sortField}
          currentSortOrderFromParams={sortOrder}
        >
          <MyColumn
            header="Name"
            field="name"
            onSort={handleSort}
            body={(row) => (
              <div className="flex items-center gap-3 pr-8">
                <img
                  src={row.avatar}
                  alt={row.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.name}
                  </span>
                  <span className="whitespace-nowrap text-sm text-gray-500">{row.role}</span>
                </div>
              </div>
            )}
          />
          <MyColumn
            header="Level"
            field="level"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.level}</span>}
          />
          <MyColumn
            header="Kolektibilitas"
            field="kolektibilitas"
            onSort={handleSort}
            body={(row) => (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeColor(
                  row.kolektibilitas
                )}`}
              >
                {row.kolektibilitas}
              </span>
            )}
          />
          <MyColumn
            header="Credit score"
            field="creditScore"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.creditScore}</span>}
          />
          <MyColumn
            header="Footprint/3 mo."
            field="footprint"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.footprint}</span>}
          />
          <MyColumn
            header="Outstanding"
            field="outstanding"
            onSort={handleSort}
            body={(row) => <span className="text-sm text-gray-600">{row.outstanding}</span>}
          />
          <MyColumn
            header="Data as"
            field="dataAs"
            onSort={handleSort}
            body={(row) => (
              <span className="whitespace-nowrap text-sm text-gray-600">{row.dataAs}</span>
            )}
          />
        </MyDataTable>
      </div>
    </div>
  )
}

export default EmployeeTable
