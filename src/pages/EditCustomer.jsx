import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom'
import CustomerHeader from '../components/customers/CustomerHeader'
import EditCustomerForm from '../components/customers/forms/EditCustomerForm'

import { handleUpdateCustomer } from '../actions/customer'
import { updateCustomer } from '../store/reducers/customerSlice';

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [isSaving, setIsSaving] = useState(false);
  const customers = useSelector((state) => state.customer.customers); // Get customers from Redux

  const customerData = customers.find((customer) => customer._id === id);

  const handleBack = () => {
    navigate(`/customer/${id}`);
  };

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    try {
      handleUpdateCustomer(id, formData, (updatedCutomer) => {
        dispatch(updateCustomer(updatedCutomer));
        navigate(`/customer/${id}`);
      });
    } catch (error) {
      console.error("Error updating customer:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        navigate("/customers", {
          state: { activeTab: "Customers" },
        });
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <CustomerHeader
          title="Edit Customer"
          onBack={handleBack}
          showEditButton={false}
        />

        {customerData && (
          <EditCustomerForm
            customer={customerData}
            existingFiles={customerData.attachments}
            onSubmit={handleSubmit}
            onCancel={handleBack}
            onDelete={handleDelete}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}

export default EditCustomer 