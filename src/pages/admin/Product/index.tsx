/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import Table from "../../../components/ui/Table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import {
  createProduct,
  deleteProduct,
  getProducts,
  resetProductState,
  setSearchField,
  updateProduct,
} from "../../../features/product/productSlice";
import { Modal } from "../../../components/ui/Modal";
import { IProduct } from "../../../types/product.types";
import { getCategories } from "../../../features/category/categorySlice";
import { BsSearch } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { uploadImageProduct } from "../../../utils/uploadImage";
import { ImSpinner3 } from "react-icons/im";
import Pagination from "../../../components/ui/Pagination";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ICategory } from "../../../types/category.types";

interface IProductPayload {
  _id?: string;
  productName: string;
  description: string;
  price: number;
  quantity: number;
  images: { url: string; title: string }[];
  category: ICategory;
  material: string;
  stockQuantity: number;
  availability: string;
  discount: number;
  isFeatured: boolean;
  brand: string;
}

const ProductManagement = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [UploadImageInput, setUploadImageInput] = useState("");

  const columns = [
    { key: "images", label: "Image", sortable: false },
    { key: "productName", label: "Name", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "stockQuantity", label: "Stock", sortable: true },
    { key: "averageRating", label: "Rating", sortable: true },
    { key: "isFeatured", label: "Featured", sortable: true },
    { key: "createdAt", label: "Created Date", sortable: true },
  ];

  const productState = useSelector((state: RootState) => state.productReducer);
  const [selectedProduct, setSelectedProduct] = useState<string[]>([]);
  const categoryState = useSelector(
    (state: RootState) => state.categoryReducer
  );
  const { categories } = categoryState;
  const {
    products,
    searchField,
    isError,
    isSuccess,
    createdProduct,
    updatedProduct,
    message,
    isLoading,
    totalPages,
  } = productState;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const query = `page=${currentPage}&limit=${itemsPerPage}`;
    dispatch(getProducts(query));
    dispatch(getCategories(""));
    dispatch(resetProductState());
  }, [dispatch, currentPage]);

  const formik = useFormik<IProductPayload>({
    initialValues: {
      _id: "",
      productName: "",
      description: "",
      price: 0,
      quantity: 0,
      images: [], // Initialize as an empty array
      category: { _id: "", name: "", description: "", productCount: 0 }, // Default ICategory
      material: "",
      stockQuantity: 0,
      availability: "In Stock",
      discount: 0,
      isFeatured: false,
      brand: "",
    },
    validationSchema: Yup.object({
      productName: Yup.string()
        .min(5, "Name must be at least 5 characters long")
        .required("Product name is required"),
      price: Yup.number()
        .min(0.01, "Price must be greater than zero")
        .required("Price is required"),
      quantity: Yup.number()
        .min(0, "Quantity must be zero or greater")
        .required("Quantity is required"),
      category: Yup.object().shape({
        _id: Yup.string().required("Category is required"),
      }),
      stockQuantity: Yup.number()
        .min(0, "Stock Quantity must be zero or greater")
        .required("Stock Quantity is required"),
      availability: Yup.string().required("Availability is required"),
      brand: Yup.string().required("Brand is required"),
    }),
    onSubmit: async (values) => {
      const selectedCategory = categories.find(
        (cat) => cat._id === values.category._id
      );

      if (!selectedCategory) {
        toast.error("Selected category is invalid.");
        return;
      }

      const payload: IProductPayload = {
        ...values,
        category: selectedCategory, // Ensure category is not undefined
      };

      if (!values._id) {
        delete payload._id;
      }

      if (values._id) {
        await dispatch(updateProduct(payload));
      } else {
        await dispatch(createProduct(payload));
      }

      await dispatch(resetProductState());
      await dispatch(getProducts(""));
      setIsModalOpen(false);
    },
  });

  const openModal = (product: IProduct | null = null) => {
    if (product) {
      formik.setValues({
        _id: product._id || "",
        productName: product.productName || "",
        description: product.description || "",
        price: product.price || 0,
        quantity: product.quantity || 0,
        images: product.images || [], // Ensure images is an array
        category: product.category || {
          _id: "",
          name: "",
          description: "",
          productCount: 0,
        }, // Default ICategory
        material: product.material || "",
        stockQuantity: product.stockQuantity || 0,
        availability: product.availability || "In Stock",
        discount: (product.discount || 0) as number,
        isFeatured: product.isFeatured || false,
        brand: product.brand || "",
      });
    } else {
      formik.resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Add product Successfully");
    }

    if (isSuccess && updatedProduct) {
      toast.success("Updated product successfully!");
    }

    if (isError) {
      toast.error(message);
    }
  }, [isError, isSuccess, createdProduct, updatedProduct, message]);

  const handleSearchInputChange = (e: any) => {
    const { name, value } = e.target;
    dispatch(setSearchField({ ...searchField, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedImages = await Promise.all(
      Array.from(files).map(async (file) => {
        const uploadImageFormCloudinary = await uploadImageProduct(file);
        return {
          url: uploadImageFormCloudinary.url,
          title: file.name,
        };
      })
    );

    // Filter out any images that do not have a valid URL
    const validImages = uploadedImages.filter((image) => image.url);

    formik.setFieldValue("images", [...formik.values.images, ...validImages]);
  };

  const handleDelete = async (id: string[]) => {
    if (window.confirm("Are u sure delete this product?")) {
      await dispatch(deleteProduct(id));
      toast.success("Delete Product Successfully!");
      dispatch(getProducts(""));
    }
  };

  const handleSelectedProduct = (id: string) => {
    setSelectedProduct((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteProductSelected = async () => {
    if (
      window.confirm("Are you sure you want to delete the selected products?")
    ) {
      await dispatch(deleteProduct(selectedProduct));
      toast.success("Delete products successfully!");
      dispatch(getProducts(""));
    }
  };

  const handleSearch = async () => {
    const payload = {
      productName: searchField.productName,
      category: searchField?.category,
      availability: searchField.availability,
    };
    await dispatch(getProducts(payload));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Product Management
      </h1>
      {/* Search Field */}
      <div className="max-w-md">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label
              htmlFor="searchName"
              className="min-w-[100px] text-sm text-left font-medium text-gray-700 mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={searchField.productName}
              onChange={handleSearchInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter name"
            />
          </div>
        </div>
      </div>
      {/* Button */}
      <div className="flex items-center justify-end mb-2 gap-4">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          onClick={handleSearch}
        >
          <BsSearch className="mr-2" /> Search
        </button>
        <button
          onClick={() => openModal(null)}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
        >
          <FiPlus className="mr-2" /> Add Product
        </button>
      </div>
      <div className="">
        <Table
          columns={columns}
          data={products}
          sortBy=""
          sortOrder="asc"
          selectedItems={selectedProduct}
          itemsPerPage={itemsPerPage}
          onDelete={handleDelete}
          onEdit={(product) => openModal(product)}
          onSort={() => {}}
          onDeleteSelected={handleDeleteProductSelected}
          onSelectItem={handleSelectedProduct}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={products.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      <div>
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title={`${formik.values._id ? "Edit Product" : "Create Product"}`}
          onSubmit={formik.handleSubmit}
          submitText={`${
            formik.values._id ? "Edit Product" : "Create Product"
          }`}
          cancelText="Cancel"
          className={
            "inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-y-auto max-h-[90vh]"
          }
        >
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formik.values.productName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {formik.touched.productName && formik.errors.productName ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.productName}
                  </div>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0  pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 pl-6 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
                {formik.touched.price && formik.errors.price ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.price}
                  </div>
                ) : null}
              </div>

              <div className="col-span-full">
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
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                {formik.touched.description && formik.errors.description ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter quantity"
                  value={formik.values.quantity}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formik.touched.quantity && formik.errors.quantity ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.quantity}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category._id"
                  value={formik.values.category._id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.category._id as string}{" "}
                    {/* Ensure error is rendered as a string */}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="material"
                  className="block text-sm font-medium text-gray-700"
                >
                  Material
                </label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formik.values.material}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="stockQuantity"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formik.values.stockQuantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
                {formik.touched.stockQuantity && formik.errors.stockQuantity ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.stockQuantity}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="availability"
                  className="block text-sm font-medium text-gray-700"
                >
                  Availability
                </label>
                <select
                  id="availability"
                  name="availability"
                  value={formik.values.availability}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select availability</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
                {formik.touched.availability && formik.errors.availability ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.availability}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Discount (%)
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formik.values.brand}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formik.touched.brand && formik.errors.brand ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.brand}
                  </div>
                ) : null}
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700">
                  Images
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          multiple
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {formik.values.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {formik.values.images.map(
                      (image: any, index: any) =>
                        image.url && ( // Ensure only valid URLs are displayed
                          <div key={index} className="relative">
                            <img
                              src={image.url}
                              alt={`Uploaded image ${image.title || ""}`} // Check for `title`
                              className="h-24 w-full object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                formik.setFieldValue(
                                  "images",
                                  formik.values.images.filter(
                                    (_, i) => i !== index
                                  )
                                )
                              }
                              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        )
                    )}
                  </div>
                )}
                <div className="flex items-center mt-4">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formik.values.isFeatured}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Mark as featured product
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Modal>
        {isLoading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg flex items-center flex-col">
              <ImSpinner3 className="animate-spin w-[40px] h-[40px]" />
              <p className="mt-4 text-gray-700">Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
