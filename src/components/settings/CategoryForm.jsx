import React, { useState, useEffect } from 'react'
import PropTypes from "prop-types";
import { Cross2Icon } from '@radix-ui/react-icons';

const CategoryForm = ({ isOpen, onClose, onSubmit, type, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || ''
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: '', description: '' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">
            {type === "category"
              ? initialData?._id
                ? "Edit Category"
                : "Add Category"
              : initialData?.categoryId
              ? "Edit Subcategory"
              : "Add Subcategory"}
          </h3>
          <button
            onClick={() => {
              onClose();
              setFormData({ name: "", description: "" });
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cross2Icon className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              {type === "category" ? "Category Name" : "Subcategory Name"}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </div>

          {type === "category" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setFormData({ name: "", description: "" });
              }}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {initialData?._id ? "Save Changes" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CategoryForm.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  type: PropTypes.string,
  initialData: PropTypes.object,
};

export default CategoryForm 