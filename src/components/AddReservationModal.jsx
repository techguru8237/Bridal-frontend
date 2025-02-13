import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

// Dummy data for customers (replace with your actual data source)
const dummyCustomers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    phone: '+212 666-123456',
    identification: 'AB123456',
    email: 'sarah@example.com'
  },
  {
    id: 2,
    name: 'Michael Brown',
    phone: '+212 666-789012',
    identification: 'CD789012',
    email: 'michael@example.com'
  },
  // Add more customers as needed
]

const AddReservationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    pickupDate: '',
    returnDate: '',
    type: '',
    status: 'Pending',
    totalAmount: '',
    notes: ''
  })

  // Customer search states
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  // const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Filter customers based on search
  const filteredCustomers = customerSearch.length >= 2
    ? dummyCustomers?.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.identification.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.phone.includes(customerSearch)
      )
    : []

  const handleCustomerSelect = (customer) => {
    // setSelectedCustomer(customer)
    setFormData(prev => ({ ...prev, customerId: customer.id }))
    setCustomerSearch(customer.name)
    setShowCustomerDropdown(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      onClose()
    } catch (error) {
      console.error('Error creating reservation:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <div className="relative w-full max-w-2xl rounded-lg bg-gray-900 border border-white/10 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Add Reservation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Cross2Icon className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Customer Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Customer <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value)
                      setShowCustomerDropdown(true)
                    }}
                    placeholder="Search customer by name, ID, or phone..."
                    className="w-full pl-9 pr-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  
                  {/* Customer Dropdown */}
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredCustomers?.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleCustomerSelect(customer)}
                          className="w-full px-4 py-2 text-left hover:bg-white/5 text-white text-sm"
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-gray-400">
                            {customer.phone} • {customer.identification}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">
                    Pickup Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">
                    Return Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Initial">Initial</option>
                  <option value="Fitting">Fitting</option>
                  <option value="Final">Final</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Total Amount <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Create Reservation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

AddReservationModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddReservationModal 