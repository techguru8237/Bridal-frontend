import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import AttachmentsSection from '../../shared/AttachmentsSection';

const EditCustomerForm = ({
  customer,
  onSubmit,
  onCancel,
  onDelete,
  isSaving,
}) => {
  const [formData, setFormData] = useState({
    name: customer.name,
    surname: customer.surname,
    email: customer.email,
    address: customer.address,
    idNumber: customer.idNumber,
    phone: customer.phone,
    whatsapp: customer.whatsapp,
    weddingDate: customer.weddingDate,
    weddingTime: customer.weddingTime,
    weddingLocation: customer.weddingLocation,
    weddingCity: customer.weddingCity,
    type: customer.type,
    attachments: customer.attachments,
  });

  const [newFiles, setNewFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append each field from formData
    for (const key in formData) {
      // Check if the value is an array (attachments)
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file, index) => {
          formDataToSend.append(`attachments[${index}][name]`, file.name);
          formDataToSend.append(`attachments[${index}][size]`, file.size);
          formDataToSend.append(`attachments[${index}][link]`, file.link);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Append newFiles if there are any
    newFiles.forEach((file) => {
      formDataToSend.append('newFiles', file);
    });

    // Call the onSubmit function with the FormData
    onSubmit(formDataToSend);
  };

  const handleFilesAdded = (files) => {
    setNewFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveNewFile = (indexOfRemove) => {
    setNewFiles((prev) => prev.filter((_, index) => index !== indexOfRemove));
  };

  const handleRemoveExisting = (fileToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments?.filter(
        (file) => file.link !== fileToRemove.link
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column */}
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
              <label className="text-sm font-medium text-gray-200">
                Surname
              </label>
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
              <label className="text-sm font-medium text-gray-200">
                Address
              </label>
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

          {/* Right Column */}
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
                {' '}
                Wedding City
              </label>
              <Input
                type="text"
                name="city"
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

        {/* Attachments Section */}
        <div className="col-span-2 mt-6">
          <AttachmentsSection
            existingFiles={formData.attachments}
            newFiles={newFiles}
            onAddFiles={handleFilesAdded}
            onRemoveNew={handleRemoveNewFile}
            onRemoveExisting={handleRemoveExisting}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="danger"
          onClick={onDelete}
          disabled={isSaving}
        >
          Delete Customer
        </Button>

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

EditCustomerForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  customer: PropTypes.object,
  onDelete: PropTypes.func,
  isSaving: PropTypes.bool,
};

export default EditCustomerForm;
