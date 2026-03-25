import { MyColumn, MyDataTable } from '@interstellar-component'
import { useDashboard } from '../Context'

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
  const { employees, sortField, sortOrder, handleSort, handleSelectionChange } = useDashboard()

  const values = {
    data: employees || [],
    meta: {
      current_page: 1,
      next_page: 2,
      per_page: 10,
      total: employees?.length || 0,
    },
    checkedAll: employees?.every((d) => d.checked),
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
