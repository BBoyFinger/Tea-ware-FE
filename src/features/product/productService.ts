import { IProduct } from "../../types/product.types";
import axiosInstance from "../../utils/axiosConfig";

const getProducts = async (query: string) => {
  const params = new URLSearchParams(query);
  const response = await axiosInstance.get("/products", {
    params: params,
  });
  return response.data.data;
};

const createProduct = async (data: IProduct) => {
  const response = await axiosInstance.post("/upload-product", data);
  return response.data.data;
};

const editProduct = async (data: IProduct) => {
  console.log(data);
  const response = await axiosInstance.put(`/product/${data._id}`, {
    productName: data.productName,
    price: data.price,
    description: data.description,
    quantity: data.quantity,

    images: data.images, // Thêm mảng hình ảnh
    category: data.category, // Thêm danh mục
    material: data.material, // Thêm chất liệu
    stockQuantity: data.stockQuantity, // Thêm số lượng tồn kho
    availability: data.availability, // Thêm trạng thái hàng hóa
    averageRating: data.averageRating, // Thêm đánh giá trung bình
    reviewsCount: data.reviewsCount, // Thêm số lượng đánh giá
    reviews: data.reviews, // Thêm danh sách đánh giá
    discount: data.discount, // Thêm phần trăm giảm giá
    isFeatured: data.isFeatured, // Thêm thông tin nổi bật
    brand: data.brand, // Thêm thương hiệu
  });

  return response.data.data;
};

const getProductByCategory = async (category: string) => {
  const respose = await axiosInstance.get(`/products/category/${category}`);
  return respose.data.data;
};

const searchProducts = async (query: string) => {
  const response = await axiosInstance.get(`products/search`, {
    params: { query },
  });
  return response.data.data;
};

const getProductBestReviews = async () => {
  const respose = await axiosInstance.get(`/products/best-reviewed`);
  return respose.data.data;
};

const getProductBestSellers = async () => {
  const respose = await axiosInstance.get(`/products/best-sellers`);
  return respose.data.data;
};

const getProductNewArrivals = async () => {
  const respose = await axiosInstance.get(`/products/new-arrivals`);
  return respose.data.data;
};

const getFeaturedProducts = async () => {
  const respose = await axiosInstance.get(`/products/product-featured`);
  return respose.data.data;
};

const getProductById = async (id: any) => {
  const response = await axiosInstance.get(`/product/${id}`);
  return response.data.data;
};

const deleteProduct = async (ids: string[]) => {
  const response = await axiosInstance.delete("/product", {
    data: { ids: ids },
  });
  return response.data.data;
};

export const productService = {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
  getProductByCategory,
  getProductById,
  getFeaturedProducts,
  getProductBestReviews,
  getProductBestSellers,
  getProductNewArrivals,
  searchProducts,
};
