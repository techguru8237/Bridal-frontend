import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomerHeader from "../components/customers/CustomerHeader";
import CustomerTabs from "../components/customers/CustomerTabs";
import CustomerDetails from "../components/customers/views/CustomerDetails";
import CustomerReservations from "../components/customers/views/CustomerReservations";
import CustomerPayments from "../components/customers/views/CustomerPayments";
import CustomerAttachments from "../components/customers/views/CustomerAttachments";

const CustomerView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const customers = useSelector((state) => state.customer.customers);
  const reservations = useSelector(state => state.reservation.reservations);
  const payments = useSelector(state => state.payment.payments);
  const customerData = customers.find((customer) => customer._id === id);
  const reservationsData = reservations?.filter(
    (item) => item.client._id === id
  );
  const paymentsData = payments?.filter((item) => item.client._id === id);

  const handleBack = () => {
    navigate("/customers", {
      state: { activeTab: "Customers" },
    });
  };

  const handleEdit = () => {
    navigate(`/customer/${id}/edit`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "details":
        return <CustomerDetails customer={customerData} />;
      case "reservations":
        return <CustomerReservations reservations={reservationsData} />;
      case "payments":
        return <CustomerPayments payments={paymentsData} />;
      case "attachments":
        return (
          <CustomerAttachments
            attachments={customerData.attachments?.map(
              (file) => ({...file, link: `${import.meta.env.VITE_BACKEND_URL}${file.link}`})
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <CustomerHeader
          title="Customer Details"
          onBack={handleBack}
          onEdit={handleEdit}
        />

        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
          <CustomerTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerView;
