import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux';
import { Dialog } from "@headlessui/react";
import { Cross2Icon } from '@radix-ui/react-icons'
import { handleCreateCustomer } from '../actions/customer';
import { addCustomer } from '../store/reducers/customerSlice';
import AddCustomerForm from '../components/customers/forms/AddCustomerForm'

const AddCustomer = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleSubmit = (formData) => {
    handleCreateCustomer(formData, (addedCustomer) => {
      dispatch(addCustomer(addedCustomer));
    })
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-start justify-center overflow-y-auto p-4">
        <Dialog.Panel className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-3xl my-8">
          <div className="sticky top-0 flex items-center justify-between mb-6 bg-gradient-to-br from-gray-900 to-gray-800 py-2">
            <Dialog.Title className="text-xl font-semibold text-white">
              Add New Customer
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Cross2Icon className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <AddCustomerForm 
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

AddCustomer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddCustomer 