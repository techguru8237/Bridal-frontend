import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Cross2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';

import { addBaseURL } from '../../utils/updateURL';

const ItemDetails = ({ item }) => {
  const categories = useSelector((state) => state.category.categories);

  const [category, setCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const category = categories.find(
      (category) => category._id == item.category
    );
    if (category) {
      setCategory(category);
    }
  }, [categories, item.category]);

    const handlePrevImage = () => {
      setCurrentImageIndex((prev) =>
        prev === 0 ? item.secondaryImages?.length - 1 : prev - 1
      );
    };

    const handleNextImage = () => {
      setCurrentImageIndex((prev) =>
        prev === item.secondaryImages?.length - 1 ? 0 : prev + 1
      );
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Images */}
      <div className="space-y-6">
        <div className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img
            src={addBaseURL(item.primaryPhoto)}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Secondary Photos Grid */}
        <div className="grid grid-cols-4 gap-4">
          {item.secondaryImages?.map((photo, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={addBaseURL(photo)}
                onClick={() => {
                  setSelectedImage(photo);
                  setCurrentImageIndex(item.secondaryImages.indexOf(photo));
                }}
                alt={`${item.name} - ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Videos */}
        {item.videoUrls && item.videoUrls.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Videos
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {item.videoUrls?.map((video, index) => (
                <div
                  key={index}
                  className="aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <video
                    src={addBaseURL(video)}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Details */}
      <div className="space-y-6">
        {/* Name Section */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
            Name
          </label>
          <p className="text-lg text-white font-medium">{item.name}</p>
        </div>

        {/* Category & SubCategory Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Category
            </label>
            <p className="text-white">{category?.name}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Sub Category
            </label>
            <p className="text-white">{item.subCategory}</p>
          </div>
        </div>

        {/* Description Section */}
        {category?.description && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Description
            </label>
            <p className="text-white whitespace-pre-wrap leading-relaxed">
              {item?.description}
            </p>
          </div>
        )}

        {/* Price & Quantity Section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Rental Cost
            </label>
            <p className="text-xl text-white font-semibold">
              MAD {item.rentalCost}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Buy Cost
            </label>
            <p className="text-xl text-white font-semibold">
              MAD{item.buyCost}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Sell Price
            </label>
            <p className="text-xl text-white font-semibold">
              MAD {item.sellPrice}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Size
            </label>
            <p className="text-xl text-white font-semibold">{item.size}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Quantity Available
            </label>
            <p className="text-xl text-white font-semibold">
              {item.quantity} units
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
            Status
          </label>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              item.status === 'Published'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            }`}
          >
            {item.status}
          </span>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="relative w-full max-w-4xl p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <Cross2Icon className="h-6 w-6 text-white" />
            </button>

            {item.secondaryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronRightIcon className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            <img
              src={addBaseURL(item.secondaryImages[currentImageIndex])}
              // alt={item.secondaryImages[currentImageIndex].name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg cursor-pointer"
            />

            {/* <div className="absolute bottom-4 left-4 right-4 text-white bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm">{imageFiles[currentImageIndex].name}</p>
              <p className="text-xs text-gray-300">
                {(imageFiles[currentImageIndex].size / 1024 / 1024).toFixed(2)}{' '}
                MB
              </p>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

ItemDetails.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  item: PropTypes.object,
};

export default ItemDetails;
