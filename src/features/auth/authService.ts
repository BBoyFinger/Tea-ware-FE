import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosConfig";

const getAllUser = async () => {
  const response = await axiosInstance.get("/users");
  return response.data.data;
};

const searchUser = async (searchParams: any) => {
  const query = new URLSearchParams(searchParams);
  const response = await axiosInstance.get("/users", {
    params: query,
  });
  return response.data.data;
};

const deleteUsers = async (selectedUserIds: string[]) => {
  const response = await axiosInstance.delete(`/users`, {
    data: { ids: selectedUserIds },
  });
  return response.data.data;
};

const updateUserRole = async (data: any) => {
  const response = await axiosInstance.post("/update-user", data);
  return response.data.data;
};

const addToCart = async (productId: any) => {
  try {
    const response = await axiosInstance.post("/addToCart", {
      productId: productId,
    });

    if (response.data.success) {
      toast.success(response.data.message);
    }

    if (response.data.error) {
      toast.error(response.data.message);
    }

    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      // Display the message from the server response
      toast.error(error.response.data.message || "An error occurred");
    } else {
      toast.error("An unexpected error occurred");
    }
  }
};

const userAddToCart = async () => {
  const response = await axiosInstance.get("/countAddToCartProduct");
  return response.data.data;
};

const viewProductCart = async () => {
  const response = await axiosInstance.get("/view-cart-product");
  return response.data.data;
};

const updateCartProduct = async (productId: string, newQuantity: number) => {
  const response = await axiosInstance.post("/update-cart-product", {
    _id: productId,
    quantity: newQuantity,
  });
  return response.data.data;
};

const deleteCartProduct = async (productId: string) => {
  const response = await axiosInstance.post("/delete-cart-product", {
    _id: productId,
  });
  return response.data.data;
};

const authService = {
  getAllUser,
  deleteUsers,
  updateUserRole,
  addToCart,
  userAddToCart,
  viewProductCart,
  updateCartProduct,
  deleteCartProduct,
  searchUser
};

export default authService;
