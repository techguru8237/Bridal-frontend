import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button'

const AddCustomerForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    weddingDate: "",
    weddingTime: "00:00",
    weddingCity: "",
    weddingLocation: "",
    type: "Client",
  });

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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Name</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Surname</label>
            <Input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              {' '}
              CIN/PASSPORT ID
            </label>
            <Input
              type="idNumber"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Phone</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              WhatsApp
            </label>
            <Input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Wedding Date
              </label>
              <Input
                type="date"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Wedding Time
              </label>
              <Input
                type="time"
                name="weddingTime"
                value={formData.weddingTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Wedding Location
            </label>
            <Input
              type="text"
              name="weddingLocation"
              value={formData.weddingLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Wedding City
            </label>
            <Input
              type="text"
              name="weddingCity"
              value={formData.weddingCity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2"
              required
            >
              <option value="Client">Client</option>
              <option value="Prospect">Prospect</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Customer</Button>
      </div>
    </form>
  );
}

AddCustomerForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default AddCustomerForm 