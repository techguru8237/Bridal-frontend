import { useState, useEffect } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'

const UserForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'User',
    status: 'Active'
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
        confirmPassword: '',
        role: initialData.role || 'User',
        status: initialData.status || 'Active'
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Password validation for new users or when changing password
    if (!initialData) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    } else if (formData.password) {
      // Validation when changing password for existing user
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: formData.status,
      });
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'User',
        status: 'Active'
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">
            {initialData ? 'Edit User' : 'Add User'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cross2Icon className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full h-10 rounded-md border ${
                errors.name ? 'border-red-500' : 'border-white/20'
              } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-10 rounded-md border ${
                errors.email ? 'border-red-500' : 'border-white/20'
              } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full h-10 rounded-md border ${
                errors.password ? 'border-red-500' : 'border-white/20'
              } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full h-10 rounded-md border ${
                errors.confirmPassword ? 'border-red-500' : 'border-white/20'
              } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {initialData ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm 