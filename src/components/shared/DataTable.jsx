import { useState } from 'react'
import ColumnToggle from './ColumnToggle'

const DataTable = ({ 
  data, 
  columns,
  initialVisibleColumns,
  className = ''
}) => {
  const [visibleColumns, setVisibleColumns] = useState(initialVisibleColumns || columns?.map(col => col.key))

  const handleToggleColumn = (columnKey) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        // Don't allow hiding all columns
        if (prev.length === 1) return prev
        return prev.filter(key => key !== columnKey)
      }
      return [...prev, columnKey]
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnToggle
          columns={columns}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
        />
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full ${className}`}>
          <thead>
            <tr className="border-b border-white/20">
              {columns
                .filter(column => visibleColumns.includes(column.key))
                .map(column => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-white/5">
                {columns
                  .filter(column => visibleColumns.includes(column.key))
                  .map(column => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-white"
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable 