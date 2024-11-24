import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import {
  confirmOrderByAdmin,
  createdOrderGhn,
  getOrders,
} from "../../../features/order/orderSlice";
import { Modal } from "../../../components/ui/Modal";
import { BsSearch } from "react-icons/bs";
import { ImSpinner3 } from "react-icons/im";
import Table from "../../../components/ui/Table";
import { IOrder } from "../../../types/order.type";
import axios from "axios";
import axiosInstance from "../../../utils/axiosConfig";

const OrderManagement = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
  const orderState = useSelector((state: RootState) => state.orderReducer);
  const { isLoading, orders } = orderState;

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOrder(null);
  };

  const openModal = (order: IOrder) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const [searchField, setSearchField] = useState({
    name: "",
    status: "",
  });

  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>(orders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, name } = e.target;
    setSearchField({ ...searchField, [name]: value });
  };

  const handleConfirm = async (order: any) => {
    setCurrentOrder(order);
    if (currentOrder) {
      await dispatch(createdOrderGhn(currentOrder._id));
      await dispatch(confirmOrderByAdmin(currentOrder._id));
      await dispatch(getOrders());
    }
  };

  const handleSearch = () => {
    const filtered = orders.filter((order: IOrder) => {
      const matchesStatus = searchField.status
        ? order.status === searchField.status
        : true;
      return matchesStatus;
    });
    setFilteredOrders(filtered);
  };

  const handlePrintOrder = async (orderId: any) => {
    try {
      const response = await axiosInstance.get(`/orders/print/${orderId}`);
      const orderData = response.data;

      console.log("Order data received:", orderData);

      // const printWindow = window.open("", "_blank");
      // if (printWindow) {
      //   printWindow.document.write(`
      //     <html>
      //       <head>
      //         <title>Print Order</title>
      //         <style>
      //           body { font-family: Arial, sans-serif; margin: 20px; }
      //           h1 { font-size: 24px; }
      //           p { font-size: 18px; }
      //           .order-details { margin-top: 20px; }
      //         </style>
      //       </head>
      //       <body>
      //         <h1>Order Details</h1>
      //         <div class="order-details">
      //           <p><strong>Order Number:</strong> ${orderData.order_code}</p>
      //           <p><strong>Customer Name:</strong> ${
      //             orderData.customer_name
      //           }</p>
      //           <p><strong>Address:</strong> ${orderData.shipping_address}</p>
      //           <p><strong>Status:</strong> ${orderData.status}</p>
      //           <p><strong>Total Price:</strong> $${orderData.total_price}</p>
      //           <p><strong>Date:</strong> ${new Date(
      //             orderData.created_at
      //           ).toLocaleDateString()}</p>
      //         </div>
      //       </body>
      //     </html>
      //   `);
      //   printWindow.document.close();
      //   printWindow.focus();
      //   printWindow.print();
      //   printWindow.close();
      // }
    } catch (error) {
      console.error("Error printing order:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Orders Management
      </h1>
      {/* Search Field */}
      <div className="max-w-md">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label
              htmlFor="category"
              className="block min-w-[100px] text-sm text-left font-medium text-gray-700"
            >
              Statuses
            </label>
            <select
              name="status"
              value={searchField.status}
              onChange={handleInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      {/* Button */}
      <div className="flex items-center justify-end mb-2 gap-4">
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
        >
          <BsSearch className="mr-2" /> Search
        </button>
      </div>
      {/* Table */}
      <div>
        <Table
          onConfirm={(order: any) => handleConfirm(order)}
          selectedItems={[]}
          onSelectItem={() => {}}
          onSort={() => {}}
          onEdit={(order: IOrder) => openModal(order)}
          onDeleteSelected={() => {}}
          itemsPerPage={10}
          handlePrintOrder={(order: IOrder) => handlePrintOrder(order?._id)}
          sortBy=""
          columns={[
            { key: "order_code", label: "Order Number", sortable: true },
            { key: "user", label: "Customer Name", sortable: true },
            { key: "shippingAddress", label: "Address", sortable: true },
            { key: "status", label: "Status", sortable: true },
            { key: "totalPrice", label: "Total", sortable: true },
            { key: "createdAt", label: "Date", sortable: true },
          ]}
          data={filteredOrders} // Use filtered orders
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title={""}
        onSubmit={() => {}}
        submitText={"View Order"}
        cancelText="Cancel"
        className={
          "inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-y-auto max-h-[90vh]"
        }
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Order Details
            </h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Order Number</label>
                <input
                  type="text"
                  value={currentOrder?.order_code || ""}
                  className="w-full border rounded px-2 py-1"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Customer Name</label>
                <input
                  type="text"
                  value={currentOrder?.shippingAddress.name || ""}
                  className="w-full border rounded px-2 py-1"
                  disabled
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <select
                  value={currentOrder?.status || ""}
                  className="w-full border rounded px-2 py-1"
                  disabled
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Items</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Item
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Image
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrder?.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          {item.product.productName}
                        </td>
                        <td className="px-4 py-2">
                          <img
                            src={item.product.images[0]?.url}
                            alt={item.product.images[0].title}
                            className="w-20 h-20"
                          />
                        </td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">${item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500">Shipping Address</label>
              <input
                type="text"
                value={currentOrder?.shippingAddress.detail || ""}
                className="w-full border rounded px-2 py-1"
                disabled
              />
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
  );
};

export default OrderManagement;
