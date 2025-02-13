import React from 'react'
import PropTypes from 'prop-types';

const CustomerDetails = ({ customer }) => {
  return (
    <>
      {customer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <p className="text-white">{customer?.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Surname</label>
              <p className="text-white">{customer?.surname}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="text-white">{customer?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Address</label>
              <p className="text-white">{customer?.address}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">CIN/PASSPORT ID</label>
              <p className="text-white">{customer?.idNumber}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Phone</label>
              <p className="text-white">{customer?.phone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">WhatsApp</label>
              <p className="text-white">{customer?.whatsapp}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">
                Wedding Date & Time
              </label>
              <p className="text-white">
                {customer?.weddingDate} at {customer?.weddingTime}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Wedding Location</label>
              <p className="text-white">{customer?.weddingLocation}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Wedding City</label>
              <p className="text-white">{customer?.weddingCity}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Type</label>
              <p className="text-white">{customer?.type}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Define prop types
CustomerDetails.propTypes = {
  customer: PropTypes.object, 
};

export default CustomerDetails 