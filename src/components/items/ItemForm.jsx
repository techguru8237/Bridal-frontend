import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Cross2Icon, ImageIcon, VideoIcon } from '@radix-ui/react-icons';
import { addBaseURL, removeBaseURL } from '../../utils/updateURL';

const ItemForm = ({ isOpen, onClose, onSubmit, initialData, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    primaryPhoto: '',
    secondaryImages: [],
    videoUrls: [],
    rentalCost: '',
    buyCost: '',
    sellPrice: 0,
    size: 0,
    category: '',
    subCategory: '',
    quantity: 0,
    status: 'Draft',
  });

  const [errors, setErrors] = useState({});
  const [availableSubCategories, setAvailableSubCategories] = useState([]);

  const [primaryPhoto, setPrimaryPhoto] = useState(null);
  const [primaryPhotoPreview, setPrimaryPhotoPreview] = useState('');
  const [secondaryPhotos, setSecondaryPhotos] = useState([]);
  const [secondaryPhotosPreviews, setSecondaryPhotosPreviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.primaryPhoto) {
        setPrimaryPhotoPreview(addBaseURL(initialData.primaryPhoto));
      }
      if (initialData.secondaryImages) {
        setSecondaryPhotosPreviews(
          initialData.secondaryImages?.map((image) => addBaseURL(image))
        );
      }
      if (initialData.videoUrls) {
        setVideoPreviews(
          initialData.videoUrls?.map((video) => addBaseURL(video))
        );
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.category && categories) {
      const category = categories.find((c) => c._id === formData.category);
      setAvailableSubCategories(category ? category.subCategories : []);
    }
  }, [formData.category, categories]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      if (name === 'primaryPhoto') {
        const file = e.target.files[0];
        if (file) {
          setPrimaryPhoto(file);
          setPrimaryPhotoPreview(URL.createObjectURL(file));
        }
      } else if (name === 'secondaryPhotos') {
        const files = Array.from(e.target.files);
        const previews = files?.map((file) => URL.createObjectURL(file));
        setSecondaryPhotos((exists) => [...exists, ...files]);
        setSecondaryPhotosPreviews((exists) => [...exists, ...previews]);
      } else if (name === 'videos') {
        const files = Array.from(e.target.files);
        setVideos((exists) => [...exists, ...files]);
        const previews = files?.map((file) => URL.createObjectURL(file));
        setVideoPreviews((exists) => [...exists, ...previews]);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRemoveSecondaryPhoto = (index) => {
    setSecondaryPhotos((prev) => prev.filter((_, i) => i !== index));
    setSecondaryPhotosPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (primaryPhoto === null && primaryPhotoPreview === '')
      newErrors.primaryPhoto = 'Primary photo is required';
    if (!formData.rentalCost) newErrors.rentalCost = 'Rental cost is required';
    if (!formData.buyCost) newErrors.buyCost = 'Rental cost is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subCategory)
      newErrors.subCategory = 'Sub-category is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (formData.quantity < 0)
      newErrors.quantity = 'Quantity cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('rentalCost', formData.rentalCost);
      formDataToSubmit.append('buyCost', formData.buyCost);
      formDataToSubmit.append('sellPrice', formData.sellPrice);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('size', formData.size);
      formDataToSubmit.append('subCategory', formData.subCategory);
      formDataToSubmit.append('quantity', formData.quantity);
      formDataToSubmit.append('status', formData.status);
      formDataToSubmit.append('primaryPhoto', formData.primaryPhoto);
      secondaryPhotosPreviews.forEach((preview) =>
        formDataToSubmit.append('secondaryImages', removeBaseURL(preview))
      );
      videoPreviews.forEach((video) =>
        formDataToSubmit.append('videoUrls', removeBaseURL(video))
      );

      formDataToSubmit.append('newPrimaryPhoto', primaryPhoto);
      secondaryPhotos.forEach((photo) =>
        formDataToSubmit.append('newSecondPhotos', photo)
      );
      videos.forEach((video) => formDataToSubmit.append('newVideos', video));

      onSubmit(formDataToSubmit);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 z-50">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-3xl my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-white">
            {initialData ? 'Edit Item' : 'Add Item'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cross2Icon className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.name ? 'border-red-500' : 'border-white/20'
              } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Rental Cost/Day (MAD)
              </label>
              <input
                type="number"
                name="rentalCost"
                value={formData.rentalCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full rounded-md border ${
                  errors.rentalCost ? 'border-red-500' : 'border-white/20'
                } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
              />
              {errors.rentalCost && (
                <p className="text-xs text-red-400">{errors.rentalCost}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Buy Cost(MAD)
              </label>
              <input
                type="number"
                name="buyCost"
                value={formData.buyCost}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full rounded-md border ${
                  errors.buyCost ? 'border-red-500' : 'border-white/20'
                } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
              />
              {errors.buyCost && (
                <p className="text-xs text-red-400">{errors.buyCost}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Size
              </label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                min="0"
                className={`w-full rounded-md border ${
                  errors.size ? 'border-red-500' : 'border-white/20'
                } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
              />
              {errors.size && (
                <p className="text-xs text-red-400">{errors.size}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Sell Price (MAD)
              </label>
              <input
                type="number"
                name="sellPrice"
                value={formData.sellPrice}
                onChange={handleChange}
                min="0"
                className={`w-full rounded-md border ${
                  errors.sellPrice ? 'border-red-500' : 'border-white/20'
                } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
              />
              {errors.sellPrice && (
                <p className="text-xs text-red-400">{errors.sellPrice}</p>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  errors.category ? 'border-red-500' : 'border-white/20'
                } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-400">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Sub-category
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                disabled={!formData.category}
                className={`w-full rounded-md border ${
                  errors.subCategory ? 'border-red-500' : 'border-white/20'
                } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
              >
                <option value="">Select Sub-category</option>
                {availableSubCategories?.map((subCategory) => (
                  <option key={subCategory} value={subCategory}>
                    {subCategory}
                  </option>
                ))}
              </select>
              {errors.subCategory && (
                <p className="text-xs text-red-400">{errors.subCategory}</p>
              )}
            </div>
          </div>

          {/* Quantity and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={`w-full rounded-md border ${
                  errors.quantity ? 'border-red-500' : 'border-white/20'
                } bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20`}
              />
              {errors.quantity && (
                <p className="text-xs text-red-400">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-4">
            {/* Primary Photo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Primary Photo
              </label>
              <div className="flex items-center gap-4">
                {primaryPhotoPreview && (
                  <div className="relative w-24 h-24">
                    <img
                      src={primaryPhotoPreview}
                      alt="Primary"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPrimaryPhoto(null);
                        setPrimaryPhotoPreview('');
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <Cross2Icon className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <div className="flex-1">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-400">
                        Click to upload primary photo
                      </p>
                    </div>
                    <input
                      type="file"
                      name="primaryPhoto"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              {errors.primaryPhoto && (
                <p className="text-xs text-red-400">{errors.primaryPhoto}</p>
              )}
            </div>

            {/* Secondary Photos */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Secondary Photos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {secondaryPhotosPreviews?.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Secondary ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSecondaryPhoto(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <Cross2Icon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <input
                    type="file"
                    name="secondaryPhotos"
                    onChange={handleChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Videos */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">
                Videos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {videoPreviews?.map((video, index) => (
                  <div
                    key={index}
                    className="relative bg-white/5 rounded-lg p-3"
                  >
                    <video controls width="250">
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <Cross2Icon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <VideoIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <input
                    type="file"
                    name="videos"
                    onChange={handleChange}
                    accept="video/*"
                    multiple
                    className="hidden"
                  />
                </label>
              </div>
            </div>
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
              {initialData ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ItemForm.propTypes = {
  payments: PropTypes.array,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  categories: PropTypes.array,
};

export default ItemForm;
