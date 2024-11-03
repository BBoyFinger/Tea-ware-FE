import React, { useState, useEffect, useContext } from "react";
import { FaShoppingBag, FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IProduct } from "../types/product.types";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import {
  deleteCartProduct,
  updateCartProduct,
} from "../features/auth/authSlice";
import Context from "../context";

interface CartItem {
  count: any;
  userId: any;
  products: any;
  viewProductCart: any;
}

const ShoppingCart = ({
  count,
  userId,
  products,
  viewProductCart,
}: CartItem) => {
  const context = useContext(Context);
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    dispatch(viewProductCart());
    context?.fetchUserAddToCart();
  }, [dispatch]);

  const increaseQuantity = async (id: any, currentQuantity: number) => {
    const newQuantity = currentQuantity + 1;
    await dispatch(updateCartProduct({ productId: id, newQuantity }));
    await dispatch(viewProductCart());
  };

  const decreaseQuantity = async (id: any, currentQuantity: number) => {
    if (currentQuantity >= 2) {
      const newQuantity = currentQuantity - 1;
      await dispatch(updateCartProduct({ productId: id, newQuantity }));
      await dispatch(viewProductCart());
    }
  };

  const toggleCart = () => setIsOpen(!isOpen);

  const removeProduct = (id: any) => {
    if (window.confirm("Are u want to delete this product in cart?")) {
      dispatch(deleteCartProduct(id));
      dispatch(viewProductCart());
      context?.fetchUserAddToCart();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < products?.length; index++) {
      sum +=
        Number(products[index]?.quantity || 0) *
        (products[index]?.productId?.price || 0);
    }
    setTotalAmount(sum);
  }, [products]); // Add productsCart as a dependency

  return (
    <div className="relative ">
      <button
        onClick={toggleCart}
        className="p-2 text-white rounded-fullfocus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200"
        aria-label="Shopping cart"
      >
        <FaShoppingBag className="w-6 h-6" />
        {userId && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {isOpen && userId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end transition-opacity duration-300">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl p-6 transform transition-transform duration-500 ease-in-out">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Your Cart</h2>
              <button
                onClick={toggleCart}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close cart"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {products?.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {products?.map((item: any) => (
                  <li key={item._id} className="py-6 flex">
                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                      <img
                        src={item.productId?.images[0].url}
                        alt={item.productId?.images[0].title}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>

                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.productId?.productName}</h3>
                          <p className="ml-4">
                            ${item.productId?.price * item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              decreaseQuantity(item._id, item.quantity)
                            }
                            className="text-gray-500 focus:outline-none focus:text-gray-600"
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </button>
                          <p className="mx-2 text-gray-700">{item.quantity}</p>
                          <button
                            onClick={() =>
                              increaseQuantity(item._id, item.quantity)
                            }
                            className="text-gray-500 focus:outline-none focus:text-gray-600"
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => removeProduct(item._id)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>$ {totalAmount}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to={"/cart"}
                  className="border-2 text-2xl text-center border-[#f05338] text-black min-w-[120px] hover:text-white py-[2px] px-3 rounded-3xl hover:bg-[#f04138] transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  View Cart
                </Link>
                <button
                  className="border-2 text-2xl  border-[#f05338] text-white min-w-[120px] hover:text-red-500 py-[2px] px-3 rounded-3xl hover:bg-white bg-[#f04138] transition-colors duration-300"
                  onClick={() => alert("Proceeding  to checkout")}
                >
                  Check out
                </button>
              </div>
              <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  or{" "}
                  <button
                    type="button"
                    className="text-indigo-600 font-medium hover:text-indigo-500"
                    onClick={toggleCart}
                  >
                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
