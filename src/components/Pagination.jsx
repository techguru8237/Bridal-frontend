import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

const Pagination = React.memo(({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-lg mt-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-sm text-white"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-400">entries</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-5 w-5 text-white" />
        </button>
        
        <span className="text-sm text-white">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  )
})

export default Pagination 