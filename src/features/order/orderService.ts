import { IOrder } from "../../types/order.type";
import axiosInstance from "../../utils/axiosConfig";

const getOrders = async () => {
  const response = await axiosInstance.get("/orders");
  return response.data.data;
};

const getOrdersByUser = async (id: string) => {
  const response = await axiosInstance.get(`/orders/user/${id}`);
  return response.data.data;
};

const createOrder = async (data: IOrder) => {
  const response = await axiosInstance.post("/order", data);
  return response.data.data;
};

const editOrder = async (data: IOrder) => {
  const response = await axiosInstance.put(`/order/${data._id}`, {
    status: data.status,
    shippingAddress: data.shippingAddress,
  });

  return response.data.data;
};

const deleteOrder = async (ids: string[]) => {
  const response = await axiosInstance.delete("/order", {
    data: { ids: ids },
  });
  return response.data.data;
};

export const orderServices = {
  getOrders,
  createOrder,
  editOrder,
  deleteOrder,
  getOrdersByUser,
};
