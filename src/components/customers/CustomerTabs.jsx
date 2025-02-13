import React from 'react'
import PropTypes from 'prop-types';

const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`relative h-14 px-6 text-sm font-medium transition-colors ${
      active 
        ? 'text-white' 
        : 'text-gray-400 hover:text-white'
    }`}
  >
    {children}
    {active && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
    )}
  </button>
)

// Define prop types
TabButton.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.string,
  onClick: PropTypes.func,
};

const CustomerTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'details', label: 'Customer Details' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'payments', label: 'Payments' },
    { id: 'attachments', label: 'Attachments' }
  ]

  return (
    <div className="border-b border-white/20">
      <div className="flex">
        {tabs?.map(tab => (
          <TabButton 
            key={tab.id}
            active={activeTab === tab.id} 
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
    </div>
  )
}

// Define prop types
CustomerTabs.propTypes = {
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default CustomerTabs 