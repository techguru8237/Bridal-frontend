import { useState } from "react";
import { useSelector } from "react-redux";
import {
  PlusIcon,
  Cross2Icon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import CategoryForm from "./CategoryForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  handleAddCategory,
  handleAddSubCategory,
  handleDeleteCategory,
  handleDeleteSubCategory,
  handleUpdateCategory,
  handleUpdateSubCategory,
} from "../../actions/category";
import { useDispatch } from "react-redux";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../store/reducers/categorySlice";

const Categories = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Category handlers
  const handleAddCategoryData = (formData) => {
    handleAddCategory(formData, (newCategory) => {
      dispatch(addCategory(newCategory));
      setShowAddModal(false);
    });
  };

  const handleEditCategory = (formData) => {
    handleUpdateCategory(editingCategory._id, formData, (updatedCategory) => {
      dispatch(updateCategory(updatedCategory));
      setShowEditModal(false);
      setEditingCategory(null);
    });
  };

  // Subcategory handlers
  const handleAddSubcategoryName = (formData) => {
    handleAddSubCategory(selectedCategory, formData.name, (updatedCategory) => {
      dispatch(updateCategory(updatedCategory));
      setShowAddModal(false);
      setSelectedCategory(null);
    });
  };

  const handleEditSubcategoryName = (formData) => {
    handleUpdateSubCategory(
      editingSubcategory._id,
      editingSubcategory.name,
      formData.name,
      (updatedCategory) => {
        dispatch(updateCategory(updatedCategory));
        setShowEditModal(false);
        setEditingSubcategory(null);
      }
    );
  };

  const handleDeleteCategoryData = (categoryId) => {
    setItemToDelete({
      type: "category",
      id: categoryId,
      name: categories.find((category) => category._id === categoryId).name,
    });
    setShowDeleteModal(true)
  }

  const handleDeleteSubcategoryName = (categoryId, sub) => {
    setItemToDelete({
      type: "subcategory",
      id: categoryId,
      name: sub,
      parentName: categories.find((category) => category._id === categoryId).name,
    });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete.type === "category") {
      handleDeleteCategory(itemToDelete.id);
      dispatch(deleteCategory(itemToDelete.id))
    } else {
      handleDeleteSubCategory(itemToDelete.id, itemToDelete.name, (updatedCategory) => {
        dispatch(updateCategory(updatedCategory));
      })
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Categories</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => (
          <div
            key={category._id}
            className="bg-white/10 rounded-lg p-4 space-y-4"
          >
            {/* Category */}
            <div className="flex items-center justify-between">
              {/* Category and Desription */}
              <div>
                <h3 className="text-lg font-medium text-white">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-400">
                    {category.description}
                  </p>
                )}
              </div>
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setShowEditModal(true);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Pencil1Icon className="h-4 w-4 text-blue-400" />
                </button>
                <button
                  onClick={() => handleDeleteCategoryData(category._id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Sub Categories */}
            <div className="flex flex-wrap gap-2">
              {category.subCategories?.map((sub, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full"
                >
                  <span className="text-sm text-white">{sub}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingSubcategory({
                          _id: category._id,
                          name: sub,
                        });
                        setShowEditModal(true);
                      }}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Pencil1Icon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteSubcategoryName(category._id, sub)
                      }
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Cross2Icon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  setSelectedCategory(category._id);
                  setShowAddModal(true);
                }}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/60 hover:text-white transition-colors"
              >
                + Add Subcategory
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <CategoryForm
          isOpen={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setEditingCategory(null);
            setEditingSubcategory(null);
            setSelectedCategory(null);
          }}
          onSubmit={
            showAddModal
              ? selectedCategory
                ? handleAddSubcategoryName
                : handleAddCategoryData
              : editingSubcategory
              ? handleEditSubcategoryName
              : handleEditCategory
          }
          type={
            showAddModal
              ? selectedCategory
                ? "subcategory"
                : "category"
              : editingSubcategory
              ? "subcategory"
              : "category"
          }
          initialData={
            showAddModal
              ? {
                  name: "",
                  description: "",
                }
              : editingCategory || editingSubcategory
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemType={itemToDelete?.type}
        itemName={itemToDelete?.name}
        parentName={itemToDelete?.parentName}
      />
    </div>
  );
};

export default Categories;
