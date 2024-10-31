import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axiosInstance from "./utils/axiosConfig";
import Context from "./context";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserDetails,
  userAddCartCountNumber,
  viewProductCart,
} from "./features/auth/authSlice";
import { AppDispatch, RootState } from "./store/store";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.authReducer);
  const { userAddToCartCount, user } = authState;

  const fetchUserDetails = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get("/user-detail");

      if (response.data.success) {
        dispatch(setUserDetails(response.data.data));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchUserAddToCart = async (): Promise<void> => {
    try {
      await dispatch(userAddCartCountNumber()); // Dispatch the thunk
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const fetchViewCart = async (): Promise<void> => {
    try {
      await dispatch(viewProductCart());
    } catch (error) {
      console.error("Error view to cart:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
    fetchViewCart();
  }, [dispatch]);

  useEffect(() => {
    if (authState?.user) {
      // Kiểm tra nếu đã có thông tin người dùng
      fetchUserAddToCart();
      fetchViewCart();
    }
  }, [authState.user, dispatch]);

  return (
    <>
      <Context.Provider
        value={{ fetchUserDetails, userAddToCartCount, fetchUserAddToCart }}
      >
        <ToastContainer />
        <Header />
        <main className="bg-white">
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
