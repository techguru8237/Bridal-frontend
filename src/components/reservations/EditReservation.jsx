import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Cross2Icon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { format, addDays, subDays } from "date-fns";
import { addBaseURL } from "../../utils/updateURL";
import { handleUpdateReservation } from "../../actions/reservation";
import { useDispatch } from "react-redux";
import { updateReservation } from "../../store/reducers/reservationSlice";
import { Input } from "../ui/Input";

const EditReservation = ({ isOpen, onClose, reservation }) => {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.item.items);
  const clients = useSelector((state) => state.customer.customers);
  const categories = useSelector((state) => state.category.categories);
  const reservations = useSelector((state) => state.reservation.reservations);

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    type: "Final",
    status: "Draft",
    pickupDate: "",
    returnDate: "",
    availabilityDate: "",
    fittingDate: "",
    pickupTime: "00:00",
    returnTime: "00:00",
    availabilityTime: "00:00",
    fittingTime: "00:00",
    additionalCost: 0,
    travelCost: 0,
    securityDepositPercentage: 30,
    advancePercentage: 50,
    notes: "",
    bufferBefore: 0,
    bufferAfter: 1,
    availability: 1,
    discount: 0,
  });

  // Add state for financial input type
  const [financialInputType, setFinancialInputType] = useState({
    securityDeposit: "percentage", // or 'amount'
    advance: "percentage", // or 'amount'
  });

  // Add state for item selection
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemSearchTerm, setItemSearchTerm] = useState("");

  useEffect(() => {
    if (selectedClient?.weddingDate) {
      const weddingDate = new Date(selectedClient.weddingDate);
      const pickupDate = subDays(weddingDate, formData.bufferBefore);
      const returnDate = addDays(weddingDate, formData.bufferAfter);
      const availabilityDate = addDays(
        weddingDate,
        formData.availability + formData.bufferAfter
      );

      setFormData((prev) => ({
        ...prev,
        pickupDate: format(pickupDate, "yyyy-MM-dd"),
        returnDate: format(returnDate, "yyyy-MM-dd"),
        availabilityDate: format(availabilityDate, "yyyy-MM-dd"),
      }));
    }
  }, [
    selectedClient?.weddingDate,
    formData.bufferBefore,
    formData.bufferAfter,
    formData.availability,
  ]);

  useEffect(() => {
    if (formData.type === "Fitting") {
      setFormData((prev) => ({
        ...prev,
        bufferBefore: 0,
        bufferAfter: 0,
        availability: 0,
      }));
    }
  }, [formData.type]);

  // Load reservation data when component mounts
  useEffect(() => {
    if (reservation) {
      setSelectedClient(reservation.client);
      setSelectedItems(reservation.items);
      setFormData((prev) => ({
        ...prev,
        type: reservation.type,
        status: reservation.status,
        pickupDate: reservation.pickupDate
          ? new Date(reservation.pickupDate).toISOString().split("T")[0]
          : "",
        fittingDate: reservation.fittingDate
          ? new Date(reservation.fittingDate).toISOString().split("T")[0]
          : "",
        returnDate: reservation.returnDate
          ? new Date(reservation.returnDate).toISOString().split("T")[0]
          : "",
        availabilityDate: reservation.availabilityDate
          ? new Date(reservation.availabilityDate).toISOString().split("T")[0]
          : "",
        pickupTime: reservation.pickupTime
          ? new Date(reservation.pickupDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "00:00",
        fittingTime: reservation.fittingTime
          ? new Date(reservation.fittingDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "00:00",
        returnTime: reservation.returnTime
          ? new Date(reservation.returnDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "00:00",
        availabilityTime: reservation.availabilityDate
          ? new Date(reservation.availabilityDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "00:00",
        additionalCost: reservation.additionalCost,
        travelCost: reservation.travelCost,
        securityDepositPercentage: reservation.securityDepositPercentage,
        advancePercentage: reservation.advancePercentage,
        notes: reservation.notes,
        bufferBefore: reservation.bufferBefore,
        bufferAfter: reservation.bufferAfter,
        availability: reservation.availability,
        discount: reservation.discount ?? 0,
      }));
    }
  }, [reservation]);

  const calculateFinancials = () => {
    const itemsTotal = selectedItems.reduce(
      (sum, item) => sum + item.rentalCost,
      0
    );
    const additionalCosts =
      Number(formData.additionalCost) + Number(formData.travelCost);
    const discount = Number(formData.discount);
    const subtotal = itemsTotal + additionalCosts - discount;
    const securityDeposit =
      subtotal * (formData.securityDepositPercentage / 100);
    const advance = subtotal * (formData.advancePercentage / 100);
    const total = subtotal + securityDeposit;

    return {
      itemsTotal,
      subtotal,
      securityDeposit,
      advance,
      total,
      discount,
    };
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return selectedClient && formData.type;
      case 2:
        return formData.type === "Final"
          ? formData.pickupDate &&
              formData.returnDate &&
              selectedItems.length > 0
          : formData.fittingDate &&
              selectedItems.length > 0;
      case 3: {
        const financials = calculateFinancials();
        return financials.total >= 0 && formData.status;
      }
      default:
        return false;
    }
  };

  // Update getAvailableItems to use the new availability check
  const getAvailableItems = () => {
    // Convert pickupDate and returnDate to Date objects if they are not already
    const pickup = new Date(formData.pickupDate);
    const returnDateObj = new Date(formData.availabilityDate);

    return items
      .filter((product) => {
        // If the product is reserved, check the quantity
        const reservedQuantity = reservations.reduce((total, reservation) => {
          const reservationPickup = new Date(reservation.pickupDate);
          const reservationReturn = new Date(reservation.availabilityDate);

          // Count how many of this product are reserved
          const currentProductReserved = reservation.items.filter(
            (item) => item._id.toString() === product._id.toString()
          );
          const isCurrentProductReserved =
            currentProductReserved.length > 0 &&
            ((pickup >= reservationPickup && pickup <= reservationReturn) ||
              (returnDateObj >= reservationPickup &&
                returnDateObj <= reservationReturn) ||
              (pickup <= reservationPickup &&
                returnDateObj >= reservationReturn));

          return isCurrentProductReserved ? total + 1 : total;
        }, 0);

        // Return true if the product is available and matches the search term
        return product.quantity - reservedQuantity > 0;
      })
      .filter((item) => !selectedItems.some((i) => i._id === item._id));
  };

  // Filter available items based on search and dates
  const filteredItems = getAvailableItems()?.filter((item) => {
    const categoryName = categories.find(
      (cat) => cat._id === item.category
    )?.name;
    const matchesSearch =
      item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
      categoryName.toLowerCase().includes(itemSearchTerm.toLowerCase());
    const isAvailable = !selectedItems.some(
      (selected) => selected._id === item._id
    );
    return matchesSearch && isAvailable;
  });

  const handleSubmit = async () => {
    const financials = calculateFinancials();

    try {
      const reservationData = {
        client: selectedClient._id,
        type: formData.type,
        status: formData.status,
        items: selectedItems?.map((item) => item._id),
        additionalCost: Number(formData.additionalCost),
        travelCost: Number(formData.travelCost),
        securityDepositPercentage: formData.securityDepositPercentage,
        advancePercentage: formData.advancePercentage,
        total: financials.total,
        notes: formData.notes,
        bufferBefore: formData.bufferBefore,
        bufferAfter: formData.bufferAfter,
        availability: formData.availability,
        discount: Number(formData.discount),
      };

      if (formData.type === "Final") {
        reservationData.pickupDate = `${formData.pickupDate}T${formData.pickupTime}`;
        reservationData.returnDate = `${formData.returnDate}T${formData.returnTime}`;
        reservationData.availabilityDate = `${formData.availabilityDate}T${formData.availabilityTime}`;
      } else {
        reservationData.fittingDate = `${formData.fittingDate}T${formData.fittingTime}`;
      }

      handleUpdateReservation(
        reservation._id,
        reservationData,
        (updatedReservation) => {
          dispatch(updateReservation(updatedReservation));
          setStep(1);
          onClose();
          navigate("/reservations");
        }
      );
      setFormData({
        type: "Final",
        status: "Draft",
        pickupDate: "",
        returnDate: "",
        availabilityDate: "",
        pickupTime: "00:00",
        returnTime: "00:00",
        availabilityTime: "00:00",
        additionalCost: 0,
        travelCost: 0,
        securityDepositPercentage: 30,
        advancePercentage: 50,
        notes: "",
        bufferBefore: 0,
        bufferAfter: 1,
        availability: 1,
        discount: 0,
      });
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Failed to update reservation. Please try again.");
    }
  };

  const renderClientSelection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Select Client
        </label>
        <div className="relative">
          <select
            value={selectedClient?.id || ""}
            onChange={(e) => {
              const client = clients.find((c) => c._id === e.target.value);
              setSelectedClient(client);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a client</option>
            {clients?.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} - {client.phone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedClient && (
        <div className="bg-white/5 p-4 rounded-lg space-y-2">
          <p className="text-white font-medium">
            {selectedClient.name} {selectedClient.surname}
          </p>
          <p className="text-sm text-gray-400">{selectedClient.phone}</p>
          <p className="text-sm text-gray-400">
            Wedding Date: {selectedClient.weddingDate}
          </p>
          <p className="text-sm text-gray-400">
            City: {selectedClient.weddingCity}
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Reservation Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Final">Final</option>
          <option value="Fitting">Fitting</option>
        </select>
      </div>
    </div>
  );

  const renderItemSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-400">
          Selected Items
        </label>
        <button
          onClick={() => setIsItemModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="space-y-4">
        {selectedItems?.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between bg-white/5 p-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={addBaseURL(item.primaryPhoto)}
                alt={item.name}
                className="h-16 w-16 object-cover rounded-lg"
              />
              <div>
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-sm text-gray-400">MAD{item.rentalCost}</p>
              </div>
            </div>
            <button
              onClick={() =>
                setSelectedItems(
                  selectedItems?.filter((i) => i._id !== item._id)
                )
              }
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Item Selection Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Add Items</h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Cross2Icon className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={itemSearchTerm}
                onChange={(e) => setItemSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Available Items */}
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredItems?.map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    setSelectedItems([...selectedItems, item]);
                    setIsItemModalOpen(false);
                  }}
                  className="flex items-start gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <img
                    src={addBaseURL(item.primaryPhoto)}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      MAD{item.rentalCost}
                    </p>
                    <p className="text-sm text-gray-400">
                      {
                        categories.find((cat) => cat._id === item.category)
                          ?.name
                      }
                    </p>
                    <span className="inline-flex items-center px-2 py-1 mt-2 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                      Available
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date Selection */}
      {formData.type === "Final" ? (
        <div className="flex flex-col gap-4">
          {formData.fittingDate && (
            <div className="flex items-start gap-12">
              <div>
                <p className="text-sm text-gray-400">Fitting Date</p>
                <p className="text-lg font-medium text-white">
                  {/* {format(new Date(formData.pickupDate), "PPP")} */}
                  {formData.fittingDate
                    ? format(new Date(formData.fittingDate), "PPP")
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Fitting Time</p>
                <Input
                  type="time"
                  name="fittingTime"
                  value={formData.fittingTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fittingTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Pickup Date</p>
                <p className="text-lg font-medium text-white">
                  {/* {format(new Date(formData.pickupDate), "PPP")} */}
                  {formData.pickupDate
                    ? format(new Date(formData.pickupDate), "PPP")
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pickup Time</p>
                <Input
                  type="time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pickupTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Days Before Wedding
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bufferBefore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bufferBefore: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Return Date</p>
                <p className="text-lg font-medium text-white">
                  {formData.returnDate
                    ? format(new Date(formData.returnDate), "PPP")
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Return Time</p>
                <Input
                  type="time"
                  name="weddingTime"
                  value={formData.returnTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      returnTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Days After Wedding
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bufferAfter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bufferAfter: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">Availability Date</p>
                <p className="text-lg font-medium text-white">
                  {formData.availabilityDate
                    ? format(new Date(formData.availabilityDate), "PPP")
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Availability Time</p>
                <Input
                  type="time"
                  name="weddingTime"
                  value={formData.availabilityTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      availabilityTime: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Availability Duaration
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.availability}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availability: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-400">Fitting Date</p>
            <Input
              type="date"
              name="fittingDate"
              value={formData.fittingDate}
              onChange={(e) =>
                setFormData({ ...formData, fittingDate: e.target.value })
              }
              required
            />
          </div>
          <div>
            <p className="text-sm text-gray-400">Fitting Time</p>
            <Input
              type="time"
              name="fittingTime"
              value={formData.fittingTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fittingTime: e.target.value,
                }))
              }
              required
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderFinancialDetails = () => {
    const financials = calculateFinancials();

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Draft">Draft</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Additional Cost
            </label>
            <input
              type="number"
              value={formData.additionalCost}
              onChange={(e) =>
                setFormData({ ...formData, additionalCost: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Travel Cost
            </label>
            <input
              type="number"
              value={formData.travelCost}
              onChange={(e) =>
                setFormData({ ...formData, travelCost: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Discount
            </label>
            <input
              type="number"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Security Deposit
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setFinancialInputType((prev) => ({
                      ...prev,
                      securityDeposit: "percentage",
                    }))
                  }
                  className={`text-xs px-2 py-1 rounded ${
                    financialInputType.securityDeposit === "percentage"
                      ? "bg-blue-500 text-white"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  %
                </button>
                <button
                  onClick={() =>
                    setFinancialInputType((prev) => ({
                      ...prev,
                      securityDeposit: "amount",
                    }))
                  }
                  className={`text-xs px-2 py-1 rounded ${
                    financialInputType.securityDeposit === "amount"
                      ? "bg-blue-500 text-white"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  MAD
                </button>
              </div>
            </div>
            <input
              type="number"
              value={
                financialInputType.securityDeposit === "percentage"
                  ? formData.securityDepositPercentage
                  : financials.securityDeposit
              }
              onChange={(e) => {
                const value = Number(e.target.value);
                if (financialInputType.securityDeposit === "percentage") {
                  setFormData((prev) => ({
                    ...prev,
                    securityDepositPercentage: value,
                  }));
                } else {
                  const itemsTotal = financials.itemsTotal;
                  const percentage = (value / itemsTotal) * 100;
                  setFormData((prev) => ({
                    ...prev,
                    securityDepositPercentage: percentage,
                  }));
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Advance Payment
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setFinancialInputType((prev) => ({
                      ...prev,
                      advance: "percentage",
                    }))
                  }
                  className={`text-xs px-2 py-1 rounded ${
                    financialInputType.advance === "percentage"
                      ? "bg-blue-500 text-white"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  %
                </button>
                <button
                  onClick={() =>
                    setFinancialInputType((prev) => ({
                      ...prev,
                      advance: "amount",
                    }))
                  }
                  className={`text-xs px-2 py-1 rounded ${
                    financialInputType.advance === "amount"
                      ? "bg-blue-500 text-white"
                      : "bg-white/5 text-gray-400"
                  }`}
                >
                  MAD
                </button>
              </div>
            </div>
            <input
              type="number"
              value={
                financialInputType.advance === "percentage"
                  ? formData.advancePercentage
                  : financials.advance
              }
              onChange={(e) => {
                const value = Number(e.target.value);
                if (financialInputType.advance === "percentage") {
                  setFormData((prev) => ({
                    ...prev,
                    advancePercentage: value,
                  }));
                } else {
                  const subtotal = financials.subtotal;
                  const percentage = (value / subtotal) * 100;
                  setFormData((prev) => ({
                    ...prev,
                    advancePercentage: percentage,
                  }));
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Items Total:</span>
            <span className="text-white">
              MAD {financials.itemsTotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Additional Costs:</span>
            <span className="text-white">
              MAD{" "}
              {(
                Number(formData.additionalCost) + Number(formData.travelCost)
              ).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Discount:</span>
            <span className="text-white">
              MAD -{financials.discount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Security Deposit:</span>
            <span className="text-white">
              MAD {financials.securityDeposit.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Advance Payment:</span>
            <span className="text-white">
              MAD {financials.advance.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between font-medium pt-2 border-t border-white/10">
            <span className="text-gray-400">Total:</span>
            <span className="text-white">
              MAD {financials.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderClientSelection();
      case 2:
        return renderItemSelection();
      case 3:
        return renderFinancialDetails();
      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: "Client Details" },
    { number: 2, title: "Items & Dates" },
    { number: 3, title: "Financial Details" },
  ];

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 z-50">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Edit Reservation #{reservation?.id}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Cross2Icon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps?.map((stepItem, index) => (
              <div
                key={stepItem.number}
                className={`flex-1 relative ${
                  index !== steps.length - 1
                    ? 'after:content-[""] after:absolute after:top-[15px] after:left-[calc(50%+24px)] after:w-[calc(100%-48px)] after:h-[2px]'
                    : ""
                }`}
              >
                <div
                  className={`relative z-10 flex flex-col items-center ${
                    index !== steps.length - 1 ? "after:bg-white/10" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium mb-2 transition-colors ${
                      step >= stepItem.number
                        ? "bg-blue-500 text-white"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {stepItem.number}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      step >= stepItem.number ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {stepItem.title}
                  </span>
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute top-[15px] left-[calc(50%+24px)] w-[calc(100%-48px)] h-[2px] ${
                      step > stepItem.number ? "bg-blue-500" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
              step === 1 ? "invisible" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Previous
          </button>

          {step === 3 ? (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(step)}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                validateStep(step)
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-500/50 cursor-not-allowed"
              }`}
            >
              Update Reservation
            </button>
          ) : (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!validateStep(step)}
              className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                validateStep(step)
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-500/50 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

EditReservation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  reservation: PropTypes.object,
};

export default EditReservation;
