import React, { useState, useEffect } from "react";
import { FaBox, FaTruck, FaCheck, FaClock } from "react-icons/fa";
import { BiPackage } from "react-icons/bi";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface OrderData {
  orderId: string;
  orderDate: string;
  expectedDelivery: string;
  status: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const MyOrder: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData>({
    orderId: "ORD-2024-001",
    orderDate: "2024-01-20",
    expectedDelivery: "2024-01-25",
    status: "in-transit",
    items: [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        quantity: 2,
        price: 199.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      },
      {
        id: 2,
        name: "Smart Fitness Watch",
        quantity: 1,
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      },
    ],
    shippingAddress: {
      street: "123 Tech Lane",
      city: "Silicon Valley",
      state: "CA",
      zipCode: "94025",
    },
    subtotal: 699.97,
    shipping: 15.0,
    tax: 56.0,
    total: 770.97,
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const OrderDetails: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orderData.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
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

  const OrderSummary: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">
            ${orderData.subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            ${orderData.shipping.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">${orderData.tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-indigo-600">
              ${orderData.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const OrderStatus: React.FC = () => {
    const stages = [
      { icon: FaBox, label: "Order Placed", completed: true },
      { icon: BiPackage, label: "Packed", completed: true },
      { icon: FaTruck, label: "In Transit", completed: true },
      { icon: FaClock, label: "Out for Delivery", completed: true },
      { icon: FaCheck, label: "Delivered", completed: false },
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
              className="bg-green-500 h-full w-3/5"
              style={{ transition: "width 0.5s ease-in-out" }}
            />
            <div className="bg-gray-200 h-full w-4/5" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order #{orderData.orderId}
          </h1>
          <p className="text-gray-600">Placed on {orderData.orderDate}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OrderStatus />
            <OrderDetails />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary />
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  {orderData.shippingAddress.street}
                </p>
                <p className="text-gray-600">
                  {orderData.shippingAddress.city},{" "}
                  {orderData.shippingAddress.state}{" "}
                  {orderData.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600 mt-4">
                  Expected Delivery: {orderData.expectedDelivery}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
