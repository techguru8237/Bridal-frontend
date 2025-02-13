import * as Popover from '@radix-ui/react-popover'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'

const dateRangeOptions = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'thisWeek', label: 'This Week' },
  { id: 'nextWeek', label: 'Next Week' },
  { id: 'thisMonth', label: 'This Month' },
  { id: 'nextMonth', label: 'Next Month' }
]

const FilterPopover = ({ type, dateRange, activeRange, onRangeChange, onDateChange }) => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
        <MixerHorizontalIcon className="h-5 w-5 text-gray-400" />
      </button>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        className="w-80 rounded-lg bg-gray-800 border border-white/10 shadow-xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200"
        sideOffset={5}
        align="end"
        side="bottom"
      >
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white">Date Range</h3>
          
          {/* Predefined Options */}
          <div className="flex flex-wrap gap-2">
            {dateRangeOptions?.map(option => (
              <button
                key={option.id}
                onClick={() => onRangeChange(option.id, type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeRange === option.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Custom Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Custom Range</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => onDateChange(type, 'start', e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => onDateChange(type, 'end', e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <Popover.Arrow className="fill-gray-800" />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
)

export default FilterPopover 