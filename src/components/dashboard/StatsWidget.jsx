import React from 'react'
import PropTypes from 'prop-types';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons'


const StatsWidget = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats?.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-white/10 rounded-lg">
                <Icon className="h-6 w-6 text-white" />
              </div>
              {stat.title !== "Dress" && <div className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
                {stat.change}
              </div>}
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.title}</p>
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Define prop types
StatsWidget.propTypes = {
  stats: PropTypes.array,
};

export default StatsWidget 