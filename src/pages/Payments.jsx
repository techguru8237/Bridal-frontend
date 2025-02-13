import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import AddPayment from './AddPayment';
import Pagination from '../components/Pagination';
import { handleDeletePayment } from '../actions/payment';
import { deletePayment } from '../store/reducers/paymentSlice';

const Payments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payment.payments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    reference: true,
    customer: true,
    amount: true,
    date: true,
    paymentMethod: true,
    type: true,
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

  const filteredPayments = payments?.filter(
    (payment) =>
      payment.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPayments?.length / itemsPerPage);

  const handleRowClick = (paymentId) => {
    navigate(`/payment/${paymentId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      handleDeletePayment(id, () => {
        dispatch(deletePayment(id));
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-white">Payments</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Payment
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-md border border-white/20 bg-white/10 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        {/* Column Visibility Dropdown */}
        <div className="relative w-full flex justify-end">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm font-medium"
          >
            Toggle Columns
          </button>
          {dropdownOpen && (
            <div className="absolute top-12 z-20 bg-gray-200 rounded-lg shadow-lg p-4">
              {Object.keys(columnVisibility).map((column) => (
                <label key={column} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={columnVisibility[column]}
                    onChange={() => toggleColumn(column)}
                    className="mr-2"
                  />
                  {column.replace(/([A-Z])/g, ' $1')}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payments Table or Grid */}
      <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                {columnVisibility.id && (
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                    Id
                  </th>
                )}
                {columnVisibility.reference && (
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                    Reference
                  </th>
                )}
                {columnVisibility.customer && (
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                    Customer
                  </th>
                )}
                {columnVisibility.amount && (
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                    Amount
                  </th>
                )}
                {columnVisibility.date && (
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                )}
                {columnVisibility.paymentMethod && (
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                    Method
                  </th>
                )}
                {columnVisibility.type && (
                  <th className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                    Type
                  </th>
                )}
                {columnVisibility.actions && (
                  <th className="text-right text-xs font-medium text-gray-300 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {currentItems?.map((payment, index) => (
                <tr
                  key={index}
                  className="hover:bg-white/5 transition-colors"
                >
                  {columnVisibility.id && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      #{index + 1}
                    </td>
                  )}
                  {columnVisibility.reference && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {payment.reference}
                    </td>
                  )}
                  {columnVisibility.customer && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {payment.client.name} {payment.client.surname}
                    </td>
                  )}
                  {columnVisibility.amount && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      MAD {payment.amount.toLocaleString()}
                    </td>
                  )}
                  {columnVisibility.date && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                  )}
                  {columnVisibility.paymentMethod && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {payment.paymentMethod}
                    </td>
                  )}
                  {columnVisibility.type && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {payment.paymentType}
                    </td>
                  )}
                  {columnVisibility.actions && <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-1 hover:bg-white/10 rounded"
                        onClick={() => handleRowClick(payment._id)}
                      >
                        <EyeOpenIcon className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/payment/${payment._id}/edit`);
                        }}
                      >
                        <Pencil1Icon className="h-4 w-4 text-blue-400" />
                      </button>
                      <button
                        className="p-1 hover:bg-white/10 rounded"
                        title="Delete"
                        onClick={() => handleDelete(payment._id)}
                      >
                        <TrashIcon className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Add Payment Modal */}
      {showAddModal && (
        <AddPayment
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Payments;
