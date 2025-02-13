import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";

import { addBaseURL } from "../utils/updateURL";

import DeleteConfirmationModal from "../components/settings/DeleteConfirmationModal";
import { addItem, deleteItem, updateItem } from "../store/reducers/itemSlice";
import { handleCreateProduct, handleDeleteProduct, handleUpdateProduct } from "../actions/product";

import ItemForm from "../components/items/ItemForm";
import Pagination from "../components/Pagination";
import ItemView from "../components/items/ItemView";

const Items = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const {id} = useParams()
  const items = useSelector((state) => state.item.items);
  const categories = useSelector((state) => state.category.categories);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Add this useEffect to handle navigation from Quick Actions
  useEffect(() => {
    if (location.state?.showAddModal) {
      setShowAddModal(true);
      // Clear the state after showing modal
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Effect to open the modal if an ID is present in the URL
  useEffect(() => {
    if (id) {
      const item = items.find((item) => item._id === id);
      if (item) {
        setSelectedItem(item);
        setShowViewModal(true);
      }
    }
  }, [id, items]);

  // Handle adding new item
  const handleAddItem = (formData) => {
    handleCreateProduct(formData, (newItem) => {
      dispatch(addItem(newItem));
    });
    setShowAddModal(false);
  };
  // Handle editing item
  const handleEditItem = (formData) => {
    handleUpdateProduct(editingItem._id, formData, (updatedItem) => {
      dispatch(updateItem(updatedItem));
      setShowEditModal(false);
      setEditingItem(null);
    });
  };

  // Handle deleting item
  const handleDeleteItem = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = (itemId) => {
    handleDeleteProduct(itemId, () => {
      dispatch(deleteItem(itemId));
      setShowDeleteModal(false);
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter items
  const filteredItems = items?.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category)
      return false;
    if (filters.status !== "all" && item.status !== filters.status)
      return false;
    return true;
  });

  // Then paginate
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Items</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 bg-white/5 p-4 rounded-lg">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="all">All Categories</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems?.map((item) => (
            <div
              key={item._id}
              className="bg-white/10 rounded-lg overflow-hidden group"
            >
              {/* Item Image */}
              <div className="relative aspect-square">
                <img
                  src={addBaseURL(item.primaryPhoto)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleView(item)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <EyeOpenIcon className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowEditModal(true);
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Pencil1Icon className="h-5 w-5 text-white" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-medium text-white">
                    {item.name}
                  </h3>
                  {item.status === 'Published' ? (
                    <EyeOpenIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <EyeNoneIcon className="h-5 w-5 text-yellow-400" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Rental Cost/Day</span>
                  <span className="text-white font-medium">
                    ${item?.rentalCost}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Buy Cost</span>
                  <span className="text-white font-medium">
                    ${item?.buyCost}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Sell Price</span>
                  <span className="text-white font-medium">
                    ${item?.sellPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Size</span>
                  <span className="text-white font-medium">
                    {item?.size}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">In Stock</span>
                  <span
                    className={`font-medium ${
                      item?.quantity > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {item?.quantity} units
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-white">
                    {
                      categories?.filter((cat) => cat._id == item?.category)[0]
                        ?.name
                    }
                  </span>
                  <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-white">
                    {item?.subCategory}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Pagination component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <ItemForm
          isOpen={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onSubmit={showAddModal ? handleAddItem : handleEditItem}
          initialData={editingItem}
          categories={categories}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={() => handleConfirmDelete(itemToDelete?._id)}
        itemType="item"
        itemName={itemToDelete?.name}
      />

      {/* Add ItemView Modal */}
      {showViewModal && selectedItem && (
        <ItemView
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default Items;
