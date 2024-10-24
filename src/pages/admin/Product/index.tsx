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

const ProductManagement = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [UploadImageInput, setUploadImageInput] = useState("");

  const columns = [
    { key: "images", label: "Image", sortable: false }, // Hình ảnh sản phẩm
    { key: "productName", label: "Name", sortable: true }, // Tên sản phẩm
    { key: "price", label: "Price", sortable: true }, // Giá sản phẩm
    { key: "category", label: "Category", sortable: true }, // Danh mục sản phẩm
    { key: "stockQuantity", label: "Stock", sortable: true }, // Số lượng tồn kho
    { key: "averageRating", label: "Rating", sortable: true }, // Đánh giá trung bình
    { key: "isFeatured", label: "Featured", sortable: true }, // Sản phẩm nổi bật
    { key: "createdAt", label: "Created Date", sortable: true }, // Ngày tạo
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
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại

  const [productInfo, setProductInfo] = useState<any | null>({
    _id: "",
    productName: "",
    description: "",
    price: 0,
    quantity: 0,
    images: [
      {
        url: "",
        title: "",
      },
    ],
    category: {
      name: "",
      desription: "",
      productCount: 0,
    },
    material: "",
    stockQuantity: 0,
    availability: "In Stock",
    averageRating: 0,
    reviewsCount: 0,
    reviews: [],
    discount: undefined,
    isFeatured: false,
    brand: "",
  });

  const validateProductForm = (product: IProduct): string | null => {
    if (!product.productName || product.productName.trim() === "") {
      return "Product name is required and Product name must be gather then 5 character";
    }

    if (product.productName.length < 5) {
      return "Name must be at least 5 characters long";
    }

    if (!product.price || product.price <= 0) {
      return "Price must be greater than zero.";
    }

    if (!product.quantity || product.quantity < 0) {
      return "Quantity must be zero or greater.";
    }

    if (!product.category || typeof product.category !== "string") {
      return "Category is required.";
    }

    if (!product.stockQuantity || product.stockQuantity < 0) {
      return "Stock Quantity must be zero or greater.";
    }

    if (!product.availability || typeof product.availability !== "string") {
      return "Availability is required.";
    }

    if (product.images && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        if (!product.images[i]?.url) {
          return `Image URL is required for image ${i + 1}.`;
        }
      }
    }

    if (product.stockQuantity && product.stockQuantity < 0) {
      return "Stock quantity must be zero or greater.";
    }

    if (product.discount && (product.discount < 0 || product.discount > 100)) {
      return "Discount must be between 0 and 100.";
    }

    if (!product.brand || product.brand.trim() === "") {
      return "Brand is required.";
    }

    return null;
  };

  useEffect(() => {
    const query = `page=${currentPage}&limit=${itemsPerPage}`;
    dispatch(getProducts(query));
    dispatch(getCategories(""));
    dispatch(resetProductState());
  }, [dispatch]);

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

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setProductInfo({
      ...productInfo,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSearchInputChange = (e: any) => {
    const { name, value } = e.target;
    dispatch(setSearchField({ ...searchField, [name]: value }));
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];

    setUploadImageInput(file?.name);

    const uploadImageFormCloudinary = await uploadImageProduct(file);

    setProductInfo((prev: any) => {
      return {
        ...prev,
        images: [{ url: uploadImageFormCloudinary.url, title: file.name }],
      };
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (product: IProduct | null = null) => {
    setProductInfo(product);
    console.log(productInfo.category.name);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string[]) => {
    if (window.confirm("Are u sure delete this product?")) {
      await dispatch(deleteProduct(id));
      toast.success("Delete Product Successfully!");
      dispatch(getProducts(""));
    }
  };

  const handleSelectedProduct = (id: string) => {
    if (selectedProduct.includes(id)) {
      setSelectedProduct(
        selectedProduct.filter((productId) => productId !== id)
      );
    } else {
      setSelectedProduct([...selectedProduct, id]);
    }
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

  const handleSubmit = async () => {
    const error = validateProductForm(productInfo);
    if (error) {
      toast.error(error);
      return;
    }

    if (productInfo?._id) {
      console.log("edit product");
      const payload = {
        _id: productInfo?._id,
        productName: productInfo.productName,
        description: productInfo.description,
        price: productInfo.price,
        quantity: productInfo.quantity,
        images: productInfo.images,
        category: productInfo.category,
        material: productInfo.material,
        stockQuantity: productInfo.stockQuantity,
        availability: productInfo.availability,
        discount: productInfo.discount,
        isFeatured: productInfo.isFeatured,
        brand: productInfo.brand,
      };
      await dispatch(updateProduct(payload));
      await dispatch(resetProductState());
    } else {
      console.log("add product");
      const payload = {
        productName: productInfo?.productName,
        description: productInfo.description,
        price: productInfo?.price,
        quantity: productInfo?.quantity,
        images: productInfo?.images,
        category: productInfo?.category,
        material: productInfo.material,
        stockQuantity: productInfo?.stockQuantity,
        availability: productInfo?.availability,
        discount: productInfo?.discount,
        isFeatured: productInfo?.isFeatured,
        brand: productInfo?.brand,
      };
      await dispatch(createProduct(payload));
      await dispatch(resetProductState());
    }

    await dispatch(getProducts(""));
    setIsModalOpen(false);
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

          {/* <div className="flex items-center gap-4">
            <label
              htmlFor="category"
              className="block min-w-[100px] text-sm text-left font-medium text-gray-700"
            >
              Category
            </label>
            <select
              name="category"
              value={searchField.category}
              id="category-select"
              onChange={handleSearchInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option defaultValue={""} className="text-sm">
                Select Categories
              </option>
              {categories.map((el) => (
                <option value={el.name} key={el._id} className="text-sm">
                  {el.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="Availability"
              className="block min-w-[100px] text-sm text-left font-medium text-gray-700"
            >
              Availability
            </label>
            <select
              name="availability"
              value={searchField.availability}
              id="availability"
              onChange={handleSearchInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option defaultValue={""} className="text-sm">
                Select availability
              </option>
              <option value={"instock"} className="text-sm">
                In Stock
              </option>
              <option value={"outstock"} className="text-sm">
                Out Stock
              </option>
            </select>
          </div> */}
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
          onClick={() => {
            console.log("avali", productInfo?.availability);
            openModal(null);
          }}
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
          title={`${
            productInfo?._id === undefined ? "Create Product" : "Edit Product"
          }`}
          onSubmit={handleSubmit}
          submitText={`${
            productInfo?._id === undefined ? "Create Product" : "Edit Product"
          }`}
          cancelText="Cancel"
          className={
            "inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-y-auto max-h-[90vh]"
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={productInfo?.productName}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={productInfo?.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-6 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
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
                value={productInfo?.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                onChange={handleInputChange}
                placeholder="Enter quantity"
                value={productInfo?.quantity}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
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
                name="category"
                value={productInfo?.category?._id}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((item) => (
                  <>
                    <option key={item._id} value={`${item._id}`}>
                      {item.name}
                    </option>
                  </>
                ))}
              </select>
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
                value={productInfo?.material}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                value={productInfo?.stockQuantity}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
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
                value={
                  productInfo?.availability
                    ? productInfo.availability.toString()
                    : ""
                }
                required
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option defaultValue="" className="text-sm">
                  Select availability
                </option>
                <option value="In Stock" className="text-sm">
                  In Stock
                </option>
                <option value="Out of Stock" className="text-sm">
                  Out of Stock
                </option>
              </select>
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
                value={productInfo?.discount}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                value={productInfo?.brand}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
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
              {productInfo?.images?.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {productInfo?.images?.map((image: any, index: any) => (
                    <div key={index} className="relative">
                      <img
                        src={image?.url}
                        alt={`Uploaded image ${image?.title}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setProductInfo((prev: any) => ({
                            ...prev,
                            images: prev.images.filter(
                              (_: any, i: any) => i !== index
                            ),
                          }))
                        }
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center mt-4">
                <input
                  id="isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  checked={productInfo?.isFeatured || false}
                  onChange={handleInputChange}
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
