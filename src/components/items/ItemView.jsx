import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Cross2Icon } from '@radix-ui/react-icons';
import ItemDetails from './ItemDetails'
import ItemAvailability from './ItemAvailability'

const ItemView = ({ isOpen, onClose, item }) => {
  const [activeTab, setActiveTab] = useState('details')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-6xl my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">
            {item.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cross2Icon className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/20 mb-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Item Details
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'availability'
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Availability
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'details' && <ItemDetails item={item} />}
          {activeTab === 'availability' && <ItemAvailability item={item} />}
        </div>
      </div>
    </div>
  )
}

ItemView.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  item: PropTypes.object,
};

export default ItemView