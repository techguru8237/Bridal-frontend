import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeftIcon,
  FileIcon,
  TrashIcon,
  UploadIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

import { handleUpdatePayment } from "../actions/payment";
import { updatePayment } from "../store/reducers/paymentSlice";

const EditPayment = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const payments = useSelector((state) => state.payment.payments);
  const clients = useSelector((state) => state.customer.customers);
  const reservations = useSelector((state) => state.reservation.reservations);

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    customer: "",
    reservation: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
    paymentType: "",
    reference: "",
    notes: "",
  });

  // Customer and Reservation states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // File states
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    const payment = payments.find((payment) => payment._id === id);

    if (payment) {
      const { client, reservation, attachments } = payment;

      // Create a new formData object with necessary properties
      const updatedFormData = {
        ...payment,
        client: client._id,
        reservation: reservation._id,
      };

      // Update state in one go
      setFormData(updatedFormData);
      setExistingFiles(attachments);
      setSelectedCustomer(client);
      setSelectedReservation(reservation);
      setCustomerSearch(client?.name || "");
    }
  }, [id, payments]);

  // Filter customers based on search
  const filteredCustomers =
    customerSearch.length >= 2
      ? clients?.filter(
          (customer) =>
            customer.name
              .toLowerCase()
              .includes(customerSearch.toLowerCase()) ||
            customer.phone.includes(customerSearch)
        )
      : [];

  // Get reservations for selected customer
  const customerReservations = selectedCustomer
    ? reservations?.filter((res) => res.client?._id === selectedCustomer._id)
    : [];

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setFormData((prev) => ({ ...prev, client: customer._id }));
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
    setSelectedReservation(null);
    setFormData((prev) => ({ ...prev, reservation: "" }));
  };

  const handleReservationSelect = (reservation) => {
    setSelectedReservation(reservation);
    setFormData((prev) => ({ ...prev, reservation: reservation._id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer || !selectedReservation) {
      alert("Please select both a customer and a reservation");
      return;
    }

    // Create FormData for file upload
    const formDataToSubmit = new FormData();

    // Append payment data
    Object.keys(formData).forEach((key) => {
      if (key === "attachments") {
        if (Array.isArray(existingFiles)) {
          existingFiles.forEach((attachment, index) => {
            formDataToSubmit.append(
              `attachments[${index}][name]`,
              attachment.name
            );
            formDataToSubmit.append(
              `attachments[${index}][size]`,
              attachment.size
            );
            formDataToSubmit.append(
              `attachments[${index}][url]`,
              attachment.url
            );
          });
        }
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Append files
    newFiles.forEach((file) => {
      formDataToSubmit.append("newFiles", file);
    });

    setIsSaving(true);
    handleUpdatePayment(id, formDataToSubmit, (updatedPayment) => {
      dispatch(updatePayment(updatedPayment));
      navigate("/payments");
      setIsSaving(false);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/payments")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
          </button>
          <h1 className="text-xl font-semibold text-white">Edit Payment</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Customer Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Customer <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    placeholder="Search customer by name, ID, or phone..."
                    className="w-full pl-9 pr-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />

                  {/* Customer Dropdown */}
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-lg max-h-60 overflow-auto">
                      {filteredCustomers?.map((customer) => (
                        <button
                          key={customer._id}
                          type="button"
                          onClick={() => handleCustomerSelect(customer)}
                          className="w-full px-4 py-2 text-left hover:bg-white/5 text-white text-sm"
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-gray-400">
                            {customer.phone} •
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reservation Selection */}
              {selectedCustomer && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">
                    Reservation <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {customerReservations?.map((reservation) => (
                      <button
                        key={reservation._id}
                        type="button"
                        onClick={() => handleReservationSelect(reservation)}
                        className={`text-left p-3 rounded-lg border ${
                          selectedReservation?._id === reservation._id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* <div className="flex justify-between items-center">
                          <span className="text-sm text-white">
                            Reservation #{reservation._id}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              reservation.paymentStatus === "Confirmed"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {reservation.paymentStatus}
                          </span>
                        </div> */}
                        <div className="mt-1 text-xs text-gray-400">
                          {reservation.pickupDate.split("T")[0]} -{" "}
                          {reservation.returnDate.split("T")[0]}
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="text-gray-400">Total</div>
                            <div className="text-white">
                              ${reservation.total}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Paid</div>
                            <div className="text-green-500">
                              {/* ${reservation.paidAmount} */}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400">Remaining</div>
                            <div className="text-yellow-500">
                              {/* ${reservation.remainingAmount} */}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rest of the payment fields */}
              {selectedCustomer && selectedReservation && (
                <>
                  {/* Amount */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        className="w-full pl-8 pr-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Payment Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.paymentDate.split("T")[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Payment Method <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      required
                    >
                      <option value="">Select a payment method</option>
                      <option value="Cash">Cash</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Check">Check</option>
                    </select>
                  </div>

                  {/* Payment Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Payment Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.paymentType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      required
                    >
                      <option value="">Select a payment type</option>
                      <option value="Advance">Advance</option>
                      <option value="Reservation">Reservation</option>
                      <option value="Final">Final</option>
                    </select>
                  </div>

                  {/* Reference */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Reference
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) =>
                        setFormData({ ...formData, reference: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Payment reference number"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Add any additional notes..."
                    />
                  </div>

                  {/* Existing Files */}
                  {existingFiles.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">
                        Existing Files
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {existingFiles?.map((file) => (
                          <div
                            key={file.url}
                            className="flex items-center gap-4 rounded-lg border border-white/20 bg-white/5 p-4"
                          >
                            <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                              <FileIcon className="h-5 w-5 text-white/60" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {file.size}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* <DownloadIcon
                                onClick={() => handleDownload(addBaseURL(file.url))}
                                className="h-4 w-4 text-blue-400 cursor-pointer"
                              /> */}
                              <button
                                type="button"
                                onClick={() => {
                                  setExistingFiles(
                                    existingFiles?.filter(
                                      (f) => f.url !== file.url
                                    )
                                  );
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <TrashIcon className="h-4 w-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">
                      Upload New Files
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-4 border-white/20">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UploadIcon className="h-8 w-8 text-gray-400" />
                        <div className="text-sm text-center">
                          <label className="text-blue-400 hover:text-blue-300 cursor-pointer">
                            <span>Click to upload</span>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                setNewFiles([...newFiles, ...files]);
                              }}
                            />
                          </label>
                          <span className="text-gray-400">
                            {" "}
                            or drag and drop
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          PDF, PNG, JPG or GIF (max. 5MB per file)
                        </p>
                      </div>
                    </div>

                    {/* New Files Preview */}
                    {newFiles.length > 0 && (
                      <div className="grid grid-cols-1 gap-3 mt-4">
                        {newFiles?.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 rounded-lg border border-white/20 bg-white/5 p-4"
                          >
                            <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                              <FileIcon className="h-5 w-5 text-white/60" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setNewFiles(
                                  newFiles?.filter((_, i) => i !== index)
                                );
                              }}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <TrashIcon className="h-4 w-4 text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/payments")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !selectedCustomer || !selectedReservation}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayment;
