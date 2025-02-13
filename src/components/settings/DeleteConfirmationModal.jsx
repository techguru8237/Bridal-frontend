import React from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemType, 
  itemName,
  parentName 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">Confirm Deletion</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cross2Icon className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            {itemType === "user" ? (
              <>
                Are you sure you want to delete {itemName} user?
              </>
            ) : itemType === "category" ? (
              <>
                Are you sure you want to delete the category "{itemName}" and
                all its subcategories? This action cannot be undone.
              </>
            ) : itemType === "subcategory" ? (
              <>
                Are you sure you want to delete the subcategory "{itemName}"
                from {parentName}? This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete the "{itemName}"? This action cannot be undone.
              </>
            )}
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal 