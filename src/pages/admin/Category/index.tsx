import { useState, useEffect, ChangeEvent } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

import { ImSpinner3 } from "react-icons/im";
import Table from "../../../components/ui/Table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import {
  createCategory,
  deleteCategory,
  getCategories,
  resetCategoryState,
  setSearchField,
  updateCategory,
} from "../../../features/category/categorySlice";
import { Modal } from "../../../components/ui/Modal";
import { ICategory } from "../../../types/category.types";
import { toast } from "react-toastify";

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryInfo, setCategoryInfo] = useState<ICategory | null>({
    name: "",
    description: "",
    _id: "",
  });
  const validateCategoryInfo = (categoryInfo: ICategory) => {
    if (!categoryInfo.name) {
      return "Name is required";
    }
    if (categoryInfo.name.length < 3) {
      return "Name must be at least 3 characters long";
    }
    if (!categoryInfo.description) {
      return "Description is required";
    }
    if (categoryInfo.description.length < 10) {
      return "Description must be at least 10 characters long";
    }
    return null;
  };
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  //redux
  const dispatch: AppDispatch = useDispatch();
  const categoryState = useSelector(
    (state: RootState) => state.categoryReducer
  );
  const {
    categories,
    isLoading,
    isError,
    isSuccess,
    createdCategory,
    updatedCategory,
    searchField,
  } = categoryState;

  useEffect(() => {
    // Simulating API call to fetch categories
    dispatch(getCategories(""));
    dispatch(resetCategoryState());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && createdCategory) {
      toast.success("Created category successfully");
    }

    if (isSuccess && updatedCategory) {
      toast.success("Updated category successfully");
    }

    if (isError) {
      toast.error("Something went wrong!");
    }
  }, [isSuccess, isError, updatedCategory, createdCategory]);

  const handleSearch = (e: any) => {
    const payload = {
      name: searchField.categoryName,
    };
    dispatch(getCategories(payload));
  };

  const handleInputChange = (e: any) => {
    const { value, name } = e.target;

    setCategoryInfo({ ...categoryInfo, [name]: value });
    dispatch(setSearchField({ [name]: value }));
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const validationError = validateCategoryInfo(categoryInfo!);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    if (categoryInfo?._id) {
      //Edit
      const payload = {
        _id: categoryInfo?._id,
        name: categoryInfo?.name,
        description: categoryInfo?.description,
      };
      await dispatch(updateCategory(payload));
      await dispatch(resetCategoryState());
    } else {
      //create
      const payload = {
        name: categoryInfo?.name,
        description: categoryInfo?.description,
      };
      await dispatch(createCategory(payload));
      await dispatch(resetCategoryState());
    }
    await dispatch(getCategories(""));

    closeModal();
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description", sortable: true },
    { key: "productCount", label: "Product Count", sortable: true },
  ];

  const handleSelectCategory = (id: any) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(
        selectedCategories.filter((categoryId) => categoryId !== id)
      );
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const openModal = (category: ICategory | null = null) => {
    setIsModalOpen(true);
    setCategoryInfo(category);
  };

  const handleDeleteCategorySelected = async () => {
    if (
      window.confirm("Are you sure you want to delete the selected category?")
    ) {
      await dispatch(deleteCategory(selectedCategories));
      toast.success("Delete Category successfully!");
      dispatch(getCategories(""));
    }
  };

  const handleDeleteCategory = async (id: any) => {
    if (window.confirm("Are u sure delete this category!")) {
      await dispatch(deleteCategory(id));
      toast.success("Delete category successfully");
    }
    await dispatch(getCategories(""));
  };
  const handleInputSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    console.log("name of input", value);
    dispatch(setSearchField({ [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            id="name"
            name="categoryName"
            placeholder="Search categories"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchField.categoryName}
            onChange={handleInputChange}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <FiPlus className="mr-2" /> Search Category
          </button>
          <button
            onClick={() => openModal(null)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <FiPlus className="mr-2" /> Add Category
          </button>
        </div>
      </div>
      {/* Table */}

      <div>
        <Table
          selectedItems={selectedCategories}
          onSelectItem={(id) => handleSelectCategory(id)}
          onSort={handleSort}
          onEdit={(category) => openModal(category)}
          onDelete={(id) => handleDeleteCategory(id)}
          onDeleteSelected={handleDeleteCategorySelected}
          itemsPerPage={categories.length}
          sortBy={sortBy}
          sortOrder={sortOrder}
          columns={columns}
          data={categories}
        />
      </div>
      {/* Modal */}

      <div>
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title={`${
            categoryInfo?._id === undefined
              ? "Create Category"
              : "Edit category"
          }`}
          onSubmit={handleSubmit}
          submitText={`${
            categoryInfo?._id === undefined
              ? "Create Category"
              : "Edit category"
          }`}
          cancelText="Cancel"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={categoryInfo?.name}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={categoryInfo?.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </Modal>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center flex-col">
            <ImSpinner3 className="animate-spin w-[40px] h-[40px]" />

            <p className="mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
