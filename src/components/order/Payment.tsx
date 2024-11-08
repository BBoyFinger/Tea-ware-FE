import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../features/order/orderSlice";
import VnPay from "./VnPay";
import { AppDispatch, RootState } from "../../store/store";

interface PaymentProps {
  isVerified: boolean;
}

interface ChoosePayState {
  payLater: boolean;
  payOnline: boolean;
}

function Payment({ isVerified }: PaymentProps) {
  const dispatch: AppDispatch = useDispatch();

  const [choosePay, setChoosePay] = useState<ChoosePayState>({
    payLater: false,
    payOnline: false,
  });

  const { orderInfo } = useSelector((state: RootState) => state.orderReducer);

  const payLater = () => {
    if (isVerified) setChoosePay({ payOnline: false, payLater: true });
  };

  const payOnline = () => {
    if (isVerified) {
      setChoosePay({ payLater: false, payOnline: true });
    }
  };

  const SendOrderPayLater = async () => {
    const OrderPaid = {
      ...orderInfo,
      status: "pendding",
      paymentMethod: "payLater",
    };
    await dispatch(createOrder(OrderPaid));
    window.location.href = "http://localhost:3000/orderSuccess";
  };

  return (
    <div className="choose-pay">
      <div className="choose flex space-x-4">
        <button
          type="submit"
          className={`${
            choosePay.payLater
              ? "border-green-500 text-green-500"
              : "border-gray-300 text-gray-700"
          } transition duration-300 ease-in-out transform hover:scale-105 hover:border-green-500 hover:text-green-500 outline-none border-2 p-2 text-sm bg-white cursor-pointer rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
          onClick={() => payLater()}
        >
          Payment on delivery
        </button>
        <button
          type="submit"
          className={`${
            choosePay.payOnline
              ? "border-green-500 text-green-500"
              : "border-gray-300 text-gray-700"
          } transition duration-300 ease-in-out transform hover:scale-105 hover:border-green-500 hover:text-green-500 outline-none border-2 p-2 text-sm bg-white cursor-pointer rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
          onClick={() => payOnline()}
        >
          Online payment
        </button>
      </div>
      {choosePay.payLater ? (
        <div className="mt-4">
          <button
            onClick={SendOrderPayLater}
            className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          >
            Đặt hàng
          </button>
        </div>
      ) : null}
      {choosePay.payOnline ? (
        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          >
            <VnPay />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Payment;
