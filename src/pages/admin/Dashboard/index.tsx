import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import {
  FiUsers,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { getAllUser } from "../../../features/auth/authSlice";
import { getProducts } from "../../../features/product/productSlice";
import { getOrders } from "../../../features/order/orderSlice";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();
  const UserState = useSelector((state: RootState) => state.authReducer);
  const ProductState = useSelector((state: RootState) => state.productReducer);
  const OrderState = useSelector((state: RootState) => state.orderReducer);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { users } = UserState;
  const { products } = ProductState;
  const { orders } = OrderState;

  useEffect(() => {
    let totalProductSum = 0;
    for (let index = 0; index < products?.length; index++) {
      totalProductSum += Number(products[index]?.quantity);
    }
    setTotalProduct(totalProductSum);
  }, [products]);

  useEffect(() => {
    let totalRevenueSum = 0;
    for (let index = 0; index < orders?.length; index++) {
      totalRevenueSum += Number(orders[index]?.totalPrice);
    }
    setTotalRevenue(totalRevenueSum);
  }, [orders]);

  useEffect(() => {
    dispatch(getAllUser());
    dispatch(getProducts({}));
    dispatch(getOrders());
  }, [dispatch]);

  // Calculate monthly revenue
  const monthlyRevenue = Array(12).fill(0);
  orders.forEach((order) => {
    const month = new Date(order.createdAt as Date).getMonth();
    monthlyRevenue[month] += Number(order.totalPrice);
  });

  const revenueData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        label: "Revenue",
        data: monthlyRevenue,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Calculate user analytics
  const activeUsers = users.filter(user => user.status === "Active").length;
  const newUsers = users.filter(user => {
    const createdAt = new Date(user.createdAt);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  }).length;
  const returningUsers = users.length - newUsers;

  const userAnalyticsData = {
    labels: ["Active Users", "New Users", "Returning Users"],
    datasets: [
      {
        data: [activeUsers, newUsers, returningUsers],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>

        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <h3 className="text-2xl font-bold">${totalRevenue}</h3>
                </div>
                <FiDollarSign className="text-3xl text-indigo-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold">{orders.length}</h3>
                </div>
                <FiShoppingBag className="text-3xl text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Customers</p>
                  <h3 className="text-2xl font-bold">{users.length}</h3>
                </div>
                <FiUsers className="text-3xl text-amber-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Products</p>
                  <h3 className="text-2xl font-bold">{totalProduct}</h3>
                </div>
                <FiPackage className="text-3xl text-red-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          Charts
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
              <Line data={revenueData} options={{ responsive: true }} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">User Analytics</h2>
              <Doughnut
                data={userAnalyticsData}
                options={{ responsive: true }}
                width={50}
                height={50}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;