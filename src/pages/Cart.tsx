import React, { useState, useEffect, useContext } from "react";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  deleteCartProduct,
  updateCartProduct,
  viewProductCart,
} from "../features/auth/authSlice";
import Context from "../context";

const CartPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const authState = useSelector((state: RootState) => state.authReducer);
  const { productsCart } = authState;
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const context = useContext(Context);
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

  useEffect(() => {
    dispatch(viewProductCart());
  }, [dispatch]);

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < productsCart?.length; index++) {
      sum +=
        Number(productsCart[index]?.quantity || 0) *
        (productsCart[index]?.productId?.price || 0);
    }
    setTotalAmount(sum);
  }, [productsCart]); // Add productsCart as a dependency

  const deleteProductCart = async (id: string) => {
    if (window.confirm("Are u sure delete this product in cart?")) {
      await dispatch(deleteCartProduct(id));
      await dispatch(viewProductCart());
      await context?.fetchUserAddToCart();
    }
  };

  const applyPromoCode = () => {
    // Simple promo code logic
    if (promoCode.toLowerCase() === "discount10") {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your Shopping Cart
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          {productsCart?.map((item: any) => (
            <div
              key={item._id}
              className="cart-item flex items-center border-b border-gray-200 py-4 transition-all duration-300 ease-in-out hover:bg-gray-50"
            >
              <img
                src={item.productId?.images[0].url}
                alt={item.productId?.images[0].title}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">
                  {item.productId?.productName}
                </h2>
                <p className="text-gray-600">${item.productId?.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => decreaseQuantity(item._id, item.quantity)}
                    className="bg-gray-200 px-2 py-1 rounded-l"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span className="bg-gray-100 px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item._id, item.quantity)}
                    className="bg-gray-200 px-2 py-1 rounded-r"
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${item.productId?.price * item?.quantity}
                </p>
                <button
                  onClick={() => deleteProductCart(item._id)}
                  className="text-red-500 mt-2 flex items-center"
                  aria-label="Remove item"
                >
                  <FaTrash className="mr-1" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="md:w-1/3">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="flex flex-col justify-between mb-2">
              {(totalAmount !== null || totalAmount !== 0) && (
                <>
                  <h4 className="text-xl font-semibold">
                    Subtotal: {totalAmount}{" "}
                  </h4>
                  <p>Taxes and shipping calcaulated at checkout</p>
                </>
              )}
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount:</span>
                <span>-${discount}</span>
              </div>
            )}

            <button
              className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-colors flex items-center justify-center"
              onClick={() => alert("Proceeding to checkout")}
            >
              <FaShoppingCart className="mr-2" /> Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
