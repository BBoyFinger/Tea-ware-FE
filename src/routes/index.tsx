import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/(auth)/Login";
import ForgotPassword from "../pages/(auth)/ForgotPassword";
import SignUp from "../pages/(auth)/SignUp";
import AdminPanel from "../pages/admin/AdminPanel";
import ProductListingPage from "../pages/products";
import ProductDetailPage from "../pages/products/[id]";
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/User";
import CategoryManagement from "../pages/admin/Category";
import ProductManagement from "../pages/admin/Product";

import OrderManagement from "../pages/admin/Order";
import CartPage from "../pages/Cart";
import BlogPage from "../pages/blog";
import AboutUs from "../pages/about";
import ContactUs from "../pages/contact";
import BlogManagement from "../pages/admin/Blog";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import BlogDetailsPage from "../pages/blog/[id]";
import Checkout from "../pages/Checkout";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.authReducer);

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.authReducer);

  return !user ? children : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/sign-up",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/admin-panel",
        element: (
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        ),
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "users",
            element: <UserManagement />,
          },
          {
            path: "categories",
            element: <CategoryManagement />,
          },
          {
            path: "products",
            element: <ProductManagement />,
          },
          {
            path: "blogs",
            element: <BlogManagement />,
          },
          {
            path: "orders",
            element: <OrderManagement />,
          },
          {
            path: "settings",
            element: <div>Settings content here</div>,
          },
        ],
      },
      {
        path: "/products",
        element: <ProductListingPage />,
      },

      {
        path: "/products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "/blog",
        element: <BlogPage />,
      },
      {
        path: "/blog/:id",
        element: <BlogDetailsPage />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
    ],
  },
]);

export default router;
