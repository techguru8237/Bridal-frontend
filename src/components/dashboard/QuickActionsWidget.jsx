import { LightningBoltIcon } from '@radix-ui/react-icons'

const QuickActionsWidget = ({ actions }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <LightningBoltIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className={`p-2 rounded-lg ${action.iconBg}`}>
              {action.icon}
            </div>
            <div className="text-left">
              <p className="text-white font-medium">{action.title}</p>
              <p className="text-sm text-gray-400">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActionsWidget 