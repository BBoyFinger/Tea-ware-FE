import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { deleteOrder, getOrders } from "../../../features/order/orderSlice";
import { Modal } from "../../../components/ui/Modal";
import { useFormik } from "formik";
import * as yup from "yup";
import { BsSearch } from "react-icons/bs";
import { ImSpinner3 } from "react-icons/im";
import Table from "../../../components/ui/Table";
import { IOrder } from "../../../types/order.type";

const OrderManagement = () => {
  const dispatch: AppDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
  const orderState = useSelector((state: RootState) => state.orderReducer);
  const { isLoading, orders } = orderState;

  const handleDeleteOrder = (ids: string[]) => {};

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]); // Ensure this effect only runs once on mount

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

  const formik = useFormik<IOrder>({
    initialValues: currentOrder || {
      _id: "",
      user: "",
      orderItems: [],
      totalPrice: 0,
      status: "Pending",
      paymentMethod: "Credit Card",
      shippingAddress: {
        province: "",
        district: "",
        ward: "",
        detail: "",
        name: "",
        phone: "",
      },
      order_code: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    enableReinitialize: true, // Reinitialize form when currentOrder changes
    validationSchema: yup.object({
      order_code: yup.string().required("Order Number is required"),
      shippingAddress: yup.object({
        name: yup.string().required("Customer Name is required"),
        detail: yup.string().required("Shipping Address is required"),
      }),
      status: yup.string().required("Status is required"),
    }),
    onSubmit: (values) => {
      console.log("Form values:", values);
      // Handle form submission
      closeModal();
    },
  });

  const handleInputChange = (e: any) => {
    const { value, name } = e.target;
  };

  const handleConfirm = () => {
    
  }

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
              htmlFor="searchName"
              className="min-w-[100px] text-sm text-left font-medium text-gray-700 mb-1"
            >
              Search Order
            </label>
            <input
              type="text"
              id="customerName"
              name="name"
              value={searchField.name}
              onChange={handleInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter name"
            />
          </div>
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
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
          <BsSearch className="mr-2" /> Search
        </button>
      </div>
      {/* Table */}
      <div>
        <Table
          onConfirm={handleConfirm}
          selectedItems={[]}
          onSelectItem={() => {}}
          onSort={() => {}}
          onEdit={(order: IOrder) => openModal(order)}
          onDelete={(id: string[]) => handleDeleteOrder(id)}
          onDeleteSelected={() => {}}
          itemsPerPage={10}
          sortBy=""
          columns={[
            { key: "order_code", label: "Order Number", sortable: true },
            { key: "user", label: "Customer Name", sortable: true },
            { key: "shippingAddress", label: "Address", sortable: true },
            { key: "status", label: "Status", sortable: true },
            { key: "totalPrice", label: "Total", sortable: true },
            { key: "createdAt", label: "Date", sortable: true },
          ]}
          data={orders}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title={""}
        onSubmit={formik.handleSubmit}
        submitText={`${
          formik.values.order_code ? "View Order" : "Create Order"
        }`}
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

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Order Number</label>
                <input
                  type="text"
                  name="order_code"
                  value={formik.values.order_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded px-2 py-1"
                  disabled
                />
                {formik.touched.order_code && formik.errors.order_code ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.order_code}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="text-sm text-gray-500">Customer Name</label>
                <input
                  type="text"
                  name="shippingAddress.name"
                  value={formik.values.shippingAddress.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded px-2 py-1"
                  disabled
                />
                {formik.touched.shippingAddress?.name &&
                formik.errors.shippingAddress?.name ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.shippingAddress.name}
                  </div>
                ) : null}
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {formik.touched.status && formik.errors.status ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.status}
                  </div>
                ) : null}
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
                    {formik.values.orderItems.map((item, index) => (
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
                name="shippingAddress.detail"
                value={formik.values.shippingAddress.detail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border rounded px-2 py-1"
                disabled
              />
              {formik.touched.shippingAddress?.detail &&
              formik.errors.shippingAddress?.detail ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.shippingAddress.detail}
                </div>
              ) : null}
            </div>
          </form>
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
