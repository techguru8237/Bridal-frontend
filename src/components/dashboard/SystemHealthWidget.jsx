import { ActivityLogIcon } from '@radix-ui/react-icons'

const SystemHealthWidget = ({ metrics }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <ActivityLogIcon className="h-5 w-5 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">System Health</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics?.map((metric) => (
          <div
            key={metric.id}
            className="p-4 bg-white/5 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400">{metric.label}</p>
              <span className={`px-2 py-1 rounded-full text-xs ${metric.statusColor}`}>
                {metric.status}
              </span>
            </div>
            <p className="text-2xl font-semibold text-white">{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemHealthWidget 