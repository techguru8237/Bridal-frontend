import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons';
import Pagination from '../components/Pagination';
import AddReservation from '../components/reservations/AddReservation';
import EditReservation from '../components/reservations/EditReservation';
import ViewReservation from '../components/reservations/ViewReservation';
import { addBaseURL } from '../utils/updateURL';
import { handleDeleteReservation } from '../actions/reservation';
import { deleteReservation } from '../store/reducers/reservationSlice';

import {
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
} from 'react-icons/md';

const Reservations = () => {
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.reservation.reservations);
  const payments = useSelector((state) => state.payment.payments);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');
  const [typeFilter, setTypeFilter] = useState(''); // Type filter (Final, Fitting)
  const [typeFilterDropdownOpen, setTypeFilterDropdownOpen] = useState(false);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    createdAt: true,
    clientName: true,
    item: true,
    weddingDate: true,
    pickupDate: true,
    returnDate: true,
    availabilityDate: true,
    fittingDate: true,
    total: true,
    type: true,
    payment: true,
    actions: true,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle column visibility
  const toggleColumn = (column) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleSort = (column) => {
    const newSortOrder =
      sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
    setTypeFilterDropdownOpen(false);
  };

  // Filter reservations based on search term and type filter
  const filteredReservations = reservations?.filter((reservation) => {
    const matchesSearchTerm =
      reservation.client?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.client?.surname
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.items[0].name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesTypeFilter = typeFilter
      ? reservation.type === typeFilter
      : true;

    return matchesSearchTerm && matchesTypeFilter;
  });

  const sortReservations = (data) => {
    return data.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (sortColumn === 'clientName') {
        aValue = `${a.client?.name} ${a.client?.surname}`;
        bValue = `${b.client?.name} ${b.client?.surname}`;
      }

      if (sortColumn === 'weddingDate') {
        aValue = `${a.client?.weddingDate}`;
        bValue = `${b.client?.weddingDate}`;
      }

      if (sortColumn === 'item') {
        aValue = `${a.items[0]?.name}`;
        bValue = `${b.items[0]?.name}`;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedReservations = sortReservations(filteredReservations);
  const currentItems = sortedReservations?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReservations?.length / itemsPerPage);

  // Update getPaymentStatus to calculate based on payments
  const getPaymentStatus = (reservation) => {
    const financials = calculateFinancials(reservation);
    const associatedPayments = payments?.filter(
      (item) => item.reservation?._id === reservation._id
    );
    const totalPaid = associatedPayments?.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    if (totalPaid >= financials.total) return 'Paid';
    if (totalPaid > 0) return 'Partial';
    return 'Unpaid';
  };

  // Add calculateFinancials helper
  const calculateFinancials = (reservation) => {
    const itemsTotal = reservation.items?.reduce(
      (sum, item) => sum + item.rentalCost,
      0
    );
    const additionalCosts =
      Number(reservation.additionalCost) + Number(reservation.travelCost);
    const subtotal = itemsTotal + additionalCosts;
    const securityDeposit =
      itemsTotal * (reservation.securityDepositPercentage / 100);
    const advance = subtotal * (reservation.advancePercentage / 100);
    const total = subtotal + securityDeposit;

    return {
      itemsTotal,
      subtotal,
      securityDeposit,
      advance,
      total,
    };
  };

  const handleViewReservation = (index, reservation) => {
    setSelectedReservation({ id: index, ...reservation });
    setIsViewModalOpen(true);
  };

  const handleEditReservation = (index, reservation) => {
    setSelectedReservation({ id: index, ...reservation });
    setIsEditModalOpen(true);
  };

  const deleteReservationData = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      handleDeleteReservation(id, () => {
        dispatch(deleteReservation(id));
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Reservations</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Reservation
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reservations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-white/20 bg-white/10 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        <div className="flex justify-end items-center gap-2">
          {/* Column Visibility Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm font-medium"
            >
              Toggle Columns
            </button>
            {dropdownOpen && (
              <div className="absolute w-40 top-12 left-0 bg-gray-800 text-white rounded-lg shadow-lg p-2 z-10">
                {Object.keys(columnVisibility).map((column) => (
                  <div
                    key={column}
                    onClick={() => toggleColumn(column)}
                    className="flex items-center justify-start rounded-md gap-2 w-full text-left p-2 text-sm hover:bg-gray-700 cursor-pointer"
                  >
                    {columnVisibility[column] ? (
                      <MdOutlineRadioButtonChecked className="text-lg" />
                    ) : (
                      <MdOutlineRadioButtonUnchecked className="text-lg" />
                    )}
                    <span className="">
                      {column.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Updated table with sorting */}
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {columnVisibility.id && (
                  <th className="text-left text-xs font-medium text-gray-400 uppercase p-4">
                    ID
                  </th>
                )}
                {columnVisibility.createdAt && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Created At
                      {sortColumn === 'createdAt' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.clientName && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('clientName')}
                  >
                    <div className="flex items-center">
                      Client Name
                      {sortColumn === 'clientName' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.item && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('item')}
                  >
                    <div className="flex items-center">
                      Item
                      {sortColumn === 'item' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.weddingDate && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('weddingDate')}
                  >
                    <div className="flex items-center">
                      Wedding Date
                      {sortColumn === 'weddingDate' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.pickupDate && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('pickupDate')}
                  >
                    <div className="flex items-center">
                      Pickup Date
                      {sortColumn === 'pickupDate' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.returnDate && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('returnDate')}
                  >
                    <div className="flex items-center">
                      Return Date
                      {sortColumn === 'returnDate' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.availabilityDate && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('availabilityDate')}
                  >
                    <div className="flex items-center">
                      Availability Date
                      {sortColumn === 'availabilityDate' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.fittingDate && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('fittingDate')}
                  >
                    <div className="flex items-center">
                      Fitting Date
                      {sortColumn === 'fittingDate' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.total && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center">
                      Total
                      {sortColumn === 'total' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.type && (
                  <th className="text-left text-xs font-medium text-gray-400 uppercase p-4 relative">
                    <div className="flex items-center">
                      Type
                      <button
                        onClick={() =>
                          setTypeFilterDropdownOpen(!typeFilterDropdownOpen)
                        }
                        className="ml-2"
                      >
                        <ChevronDownIcon className="inline h-4 w-4" />
                      </button>
                      {typeFilterDropdownOpen && (
                        <div className="absolute w-36 top-12 left-0 bg-gray-800 text-white rounded-lg shadow-lg p-2 z-10">
                          <div
                            onClick={() => handleTypeFilterChange('')}
                            className="flex items-center justify-start rounded-md gap-2 w-full text-left p-2 text-sm hover:bg-gray-700 cursor-pointer"
                          >
                            {typeFilter === '' ? (
                              <MdOutlineRadioButtonChecked className="text-lg" />
                            ) : (
                              <MdOutlineRadioButtonUnchecked className="text-lg" />
                            )}
                            <span className="">All Types</span>
                          </div>
                          <div
                            onClick={() => handleTypeFilterChange('Final')}
                            className="flex items-center justify-start rounded-md gap-2 w-full text-left p-2 text-sm hover:bg-gray-700 cursor-pointer"
                          >
                            {typeFilter === 'Final' ? (
                              <MdOutlineRadioButtonChecked className="text-lg" />
                            ) : (
                              <MdOutlineRadioButtonUnchecked className="text-lg" />
                            )}
                            <span className="">Final</span>
                          </div>
                          <div
                            onClick={() => handleTypeFilterChange('Fitting')}
                            className="flex items-center justify-start rounded-md gap-2 w-full text-left p-2 text-sm hover:bg-gray-700 cursor-pointer"
                          >
                            {typeFilter === 'Fitting' ? (
                              <MdOutlineRadioButtonChecked className="text-lg" />
                            ) : (
                              <MdOutlineRadioButtonUnchecked className="text-lg" />
                            )}
                            <span className="">Fitting</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
                )}
                {columnVisibility.payment && (
                  <th
                    className="text-left text-xs font-medium text-gray-400 uppercase p-4 cursor-pointer"
                    onClick={() => handleSort('payment')}
                  >
                    <div className="flex items-center">
                      Payment
                      {sortColumn === 'payment' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUpIcon className="inline h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="inline h-4 w-4" />
                        ))}
                    </div>
                  </th>
                )}
                {columnVisibility.actions && (
                  <th className="text-right text-xs font-medium text-gray-400 uppercase p-4">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentItems.length > 0 &&
                currentItems?.map((reservation, index) => {
                  const financials = calculateFinancials(reservation);
                  const paymentStatus = getPaymentStatus(reservation);
                  const mainItem =
                    reservation.items?.length > 0 && reservation?.items[0]; // Get first item for display

                  return (
                    <tr key={reservation._id} className="hover:bg-white/5">
                      {columnVisibility.id && (
                        <td className="p-4 text-white">#{index + 1}</td>
                      )}
                      {columnVisibility.createdAt && (
                        <td className="p-4 text-white">
                          {new Date(reservation.createdAt).toLocaleDateString()}
                        </td>
                      )}
                      {columnVisibility.clientName && (
                        <td className="p-4 text-white">
                          {reservation.client?.name}{' '}
                          {reservation.client?.surname}
                        </td>
                      )}
                      {columnVisibility.item && (
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={addBaseURL(mainItem.primaryPhoto)}
                              alt={mainItem.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="text-white text-sm">
                                {mainItem.name}
                              </span>
                              {reservation.items?.length > 1 && (
                                <span className="text-gray-400 text-xs">
                                  +{reservation.items.length - 1} more items
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      )}
                      {columnVisibility.weddingDate && (
                        <td className="p-4 text-white">
                          {new Date(
                            reservation.client?.weddingDate
                          ).toLocaleDateString()}
                        </td>
                      )}
                      {columnVisibility.pickupDate && (
                        <td className="p-4 text-white">
                          {reservation.type === "Final" ? new Date(reservation.pickupDate).toLocaleString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            }
                          ) : ""}
                        </td>
                      )}
                      {columnVisibility.returnDate && (
                        <td className="p-4 text-white">
                          {reservation.type === "Final" ? new Date(reservation.returnDate).toLocaleString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            }
                          ) : ""}
                        </td>
                      )}
                      {columnVisibility.availabilityDate && (
                        <td className="p-4 text-white">
                          {reservation.type === "Final" ? new Date(
                            reservation.availabilityDate
                          ).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          }) : ""}
                        </td>
                      )}
                      {columnVisibility.fittingDate && (
                        <td className="p-4 text-white">
                          {reservation.type === "Fitting" ? new Date(reservation.fittingDate).toLocaleString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            }
                          ) : ""}
                        </td>
                      )}
                      {columnVisibility.total && (
                        <td className="p-4 text-white">
                          MAD {financials.total.toLocaleString()}
                        </td>
                      )}
                      {columnVisibility.type && (
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              reservation.type === 'Final'
                                ? 'bg-purple-500/10 text-purple-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            {reservation.type}
                          </span>
                        </td>
                      )}
                      {columnVisibility.payment && (
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              paymentStatus === 'Paid'
                                ? 'bg-green-500/10 text-green-400'
                                : paymentStatus === 'Partial'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {paymentStatus}
                          </span>
                        </td>
                      )}
                      {columnVisibility.actions && (
                        <td className="p-4">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() =>
                                handleViewReservation(index + 1, reservation)
                              }
                              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <EyeOpenIcon className="h-4 w-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() =>
                                handleEditReservation(index + 1, reservation)
                              }
                              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Pencil1Icon className="h-4 w-4 text-gray-400" />
                            </button>
                            <button
                              onClick={() =>
                                deleteReservationData(reservation._id)
                              }
                              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <TrashIcon className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Add Reservation Modal */}
      <AddReservation
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* View Reservation Modal */}
      <ViewReservation
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
      />

      {/* Edit Reservation Modal */}
      <EditReservation
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
      />
    </div>
  );
};

export default Reservations;
