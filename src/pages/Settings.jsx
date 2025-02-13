import React, { useState } from 'react'
import Categories from '../components/settings/Categories'
import Users from '../components/settings/Users'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('categories')

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-white">Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'categories'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Users
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'categories' ? <Categories /> : <Users />}
      </div>
    </div>
  )
}

export default Settings 