import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { ImSpinner3 } from "react-icons/im";
import { toast } from "react-toastify";
import { Modal } from "../../../components/ui/Modal";
import Table from "../../../components/ui/Table";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createCategory,
  deleteCategory,
  getCategories,
  resetCategoryState,
  setSearchField,
  updateCategory,
} from "../../../features/category/categorySlice";
import { ICategory } from "../../../types/category.types";

const CategoryManagement = () => {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
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

  const formik = useFormik({
    initialValues: {
      _id: "",
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters long")
        .required("Name is required"),
      description: Yup.string()
        .min(10, "Description must be at least 10 characters long")
        .required("Description is required"),
    }),
    onSubmit: async (values: {
      _id?: string;
      name: string;
      description: string;
    }) => {
      const payload = {
        _id: values._id || "",
        name: values.name,
        description: values.description,
        productCount: 0, // Provide a default value or calculate it as needed
      };

      if (values._id) {
        await dispatch(updateCategory({ ...payload, _id: values._id }));
      } else {
        await dispatch(createCategory(payload));
      }

      await dispatch(resetCategoryState());
      await dispatch(getCategories(""));
      closeModal();
    },
  });

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSearch = () => {
    dispatch(getCategories({ name: searchField.categoryName }));
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

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "description", label: "Description", sortable: true },
    { key: "productCount", label: "Product Count", sortable: true },
  ];

  const handleSelectCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id]
    );
  };

  const openModal = (category: ICategory | null = null) => {
    setIsModalOpen(true);
    formik.setValues({
      _id: category?._id || "",
      name: category?.name || "",
      description: category?.description || "",
    });
  };

  const handleDeleteCategorySelected = async () => {
    if (
      window.confirm("Are you sure you want to delete the selected categories?")
    ) {
      await dispatch(deleteCategory(selectedCategories));
      toast.success("Delete categories successfully!");
      dispatch(getCategories(""));
    }
  };

  const handleDeleteCategory = async (ids: string[]) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await dispatch(deleteCategory(ids));
      toast.success("Delete category successfully");
      dispatch(getCategories(""));
    }
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
            onChange={(e) =>
              dispatch(setSearchField({ categoryName: e.target.value }))
            }
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <FiSearch className="mr-2" /> Search Category
          </button>
          <button
            onClick={() => openModal(null)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <FiPlus className="mr-2" /> Add Category
          </button>
        </div>
      </div>
      <div>
        <Table
          selectedItems={selectedCategories}
          onSelectItem={handleSelectCategory}
          onSort={handleSort}
          onEdit={openModal}
          onDelete={handleDeleteCategory}
          onDeleteSelected={handleDeleteCategorySelected}
          itemsPerPage={categories.length}
          sortBy={sortBy}
          sortOrder={sortOrder}
          columns={columns}
          data={categories}
        />
      </div>
      <div>
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title={`${formik.values._id ? "Edit Category" : "Create Category"}`}
          onSubmit={formik.handleSubmit}
          submitText={`${
            formik.values._id ? "Edit Category" : "Create Category"
          }`}
          cancelText="Cancel"
        >
          <form onSubmit={formik.handleSubmit}>
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              ) : null}
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
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
          </form>
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
