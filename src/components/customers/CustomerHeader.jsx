import React from 'react'
import PropTypes from "prop-types";
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/Button'

const CustomerHeader = ({ title, onBack, onEdit, showEditButton = true }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
        >
          <ArrowLeftIcon className="h-5 w-5 text-white" />
        </button>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>
      {showEditButton && (
        <Button onClick={onEdit}>
          Edit Customer
        </Button>
      )}
    </div>
  )
}

// Define prop types
CustomerHeader.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  onBack: PropTypes.func,
  onEdit: PropTypes.func,
  showEditButton: PropTypes.bool,
};

export default CustomerHeader 