import { useState } from "react";
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiDatabase,
  FiSettings,
  FiCamera,
  FiEdit2,
} from "react-icons/fi";
import { Outlet } from "react-router-dom"; // Import Outlet
import { BiCategoryAlt } from "react-icons/bi";
import { FiShoppingCart } from "react-icons/fi";

import { Link, useLocation } from "react-router-dom";
import { RiBloggerLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const location = useLocation();

  const userDetail = useSelector((state: RootState) => state.authReducer.user);

  console.log(userDetail);

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St, City, Country",
    phone: "+1 234 567 890",
    image:
      "images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3",
  });
  const isActiveTab = (path: any) => location.pathname === path;

  const handleProfileUpdate = (field: any, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`bg-gray-800 text-white w-64 min-h-screen p-4 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <nav>
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img
                src={userDetail?.pictureImg}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            <h2 className="mt-4 text-xl font-semibold">{userDetail?.name}</h2>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin-panel" // Cập nhật đường dẫn
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${
                  isActiveTab("/admin-panel")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <FiHome />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-panel/users" // Cập nhật đường dẫn
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${
                  isActiveTab("/admin-panel/users")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <FiUsers />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-panel/categories" // Cập nhật đường dẫn
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${
                  isActiveTab("/admin-panel/categories")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <BiCategoryAlt />

                <span>Categories</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-panel/products" // Cập nhật đường dẫn
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${
                  isActiveTab("/admin-panel/products")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <FiDatabase />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-panel/blogs" // Cập nhật đường dẫn
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${
                  isActiveTab("/admin-panel/blogs")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <RiBloggerLine />

                <span>Blogs</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-panel/orders" // Cập nhật đường dẫn
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${
                  isActiveTab("/admin-panel/orders")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <FiShoppingCart />
                <span>Order</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-panel/profile" // Cập nhật đường dẫn
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${
                  isActiveTab("/admin-panel/profile")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <FiEdit2 />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin-panel/setting" // Cập nhật đường dẫn
                className={`flex items-center space-x-2 w-full p-2 rounded-md ${
                  isActiveTab("/admin-panel/setting")
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                <FiSettings />
                <span>Setting </span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className=" py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleSidebar}
                  className="text-gray-500 hover:text-gray-600"
                >
                  <FiMenu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet /> {/* Sử dụng Outlet để render các component theo route */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
