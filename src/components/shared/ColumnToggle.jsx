import { useState } from 'react'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import * as Popover from '@radix-ui/react-popover'
import { Button } from '../ui/Button'

const ColumnToggle = ({ columns, visibleColumns, onToggleColumn }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          <MixerHorizontalIcon className="h-4 w-4" />
          Columns
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content 
          className="z-50 w-[200px] rounded-lg border border-white/20 bg-gray-800 p-2 shadow-lg"
          sideOffset={5}
        >
          <div className="space-y-2">
            {columns?.map((column) => (
              <label 
                key={column.key} 
                className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded-md cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.key)}
                  onChange={() => onToggleColumn(column.key)}
                  className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <span className="text-sm text-white">{column.label}</span>
              </label>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default ColumnToggle 