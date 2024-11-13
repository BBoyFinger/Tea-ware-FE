import React, { useEffect } from "react";
import { FaBox, FaTruck, FaCheck, FaClock } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrder,
  getOrdersByUser,
  updateOrderQuantity,
} from "../../features/order/orderSlice";

interface IOrderItem {
  product: {
    productName: string;
    images: [
      {
        url: string;
        title: string;
        _id: string;
      }
    ];
  };
  quantity: number;
  price: number;
}

interface IShippingAddress {
  province?: string;
  district?: string;
  ward?: string;
  detail?: string;
  name?: string;
  phone?: string;
}

interface IPaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
  email_address?: string;
}

interface IOrder {
  _id: string;
  user: string;
  orderItems: IOrderItem[];
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: "Credit Card" | "PayPal" | "Cash On Delivery";
  shippingAddress: IShippingAddress;
  paymentResult?: IPaymentResult;
  order_code?: string;
  to_ward_code?: string;
  to_district_id?: number;
  token?: string;
  cancelOrder?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const MyOrder: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const orders = useSelector(
    (state: RootState) => state.orderReducer.userOrders
  );
  const user = useSelector((state: RootState) => state.authReducer.user);

  useEffect(() => {
    if (user?._id) {
      dispatch(getOrdersByUser(user._id));
    }
  }, [dispatch, user]);

  const handleCancelOrder = (orderId: string) => {
    dispatch(cancelOrder(orderId)); // Dispatch the cancel order action
  };

  const handleUpdateQuantity = (
    orderId: string,
    itemId: string,
    newQuantity: number
  ) => {
    dispatch(updateOrderQuantity({ orderId, itemId, newQuantity })); // Dispatch the update quantity action
  };

  if (!orders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {orders.map((order: IOrder) => (
          <div key={order._id} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order.order_code || order._id}
            </h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt!).toLocaleDateString()}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <OrderStatus status={order.status} />
                <OrderDetails items={order.orderItems} />
              </div>
              <div className="lg:col-span-1">
                <OrderSummary
                  totalPrice={order.totalPrice}
                  paymentMethod={order.paymentMethod}
                />
                <ShippingInfo address={order.shippingAddress} />
                {order.status === "Pending" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderDetails: React.FC<{
  items: IOrderItem[];
}> = ({ items }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4">Order Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
        >
          <img
            src={item.product?.images[0]?.url}
            alt={item.product?.images[0]?.title}
            className="w-24 h-24 object-cover rounded-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";
            }}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {item.product.productName}
            </h3>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
            <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
            <p className="font-bold text-indigo-600">
              Total: ${(item.quantity * item.price).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
const OrderSummary: React.FC<{
  totalPrice: number;
  paymentMethod: string;
}> = ({ totalPrice, paymentMethod }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Total Price</span>
        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Payment Method</span>
        <span className="font-semibold">{paymentMethod}</span>
      </div>
    </div>
  </div>
);

const OrderStatus: React.FC<{ status: string }> = ({ status }) => {
  const stages = [
    {
      icon: FaBox,
      label: "Order Placed",
      completed: status === "Pending" || status === "Confirmed",
    },
    {
      icon: BiPackage,
      label: "Packed",
      completed: status === "Confirmed" || status === "Processing",
    },
    {
      icon: FaTruck,
      label: "In Transit",
      completed: status === "Processing" || status === "Shipped",
    },
    {
      icon: FaClock,
      label: "Out for Delivery",
      completed: status === "Shipped" || status === "Delivering",
    },
    { icon: FaCheck, label: "Delivered", completed: status === "Delivered" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Order Status</h2>
      <div className="relative">
        <div className="flex justify-between mb-2">
          {stages.map((stage, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center w-1/5"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  stage.completed
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <stage.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{stage.label}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-6 left-0 right-0 h-1 flex">
          <div
            className="bg-green-500 h-full"
            style={{
              width: `${
                (stages.filter((stage) => stage.completed).length /
                  stages.length) *
                100
              }%`,
              transition: "width 0.5s ease-in-out",
            }}
          />
          <div className="bg-gray-200 h-full flex-1" />
        </div>
      </div>
    </div>
  );
};

const ShippingInfo: React.FC<{
  address: IShippingAddress;
}> = ({ address }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
    <div className="space-y-2">
      <p className="text-gray-600">{address.detail}</p>
      <p className="text-gray-600">
        {address.ward}, {address.district}, {address.province}
      </p>
      <p className="text-gray-600 mt-4">
        Contact: {address.name} - {address.phone}
      </p>
    </div>
  </div>
);

export default MyOrder;
