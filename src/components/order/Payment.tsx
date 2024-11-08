import axios from "axios";
import React, { useEffect, useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
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
    if (isVerified) setChoosePay({ payLater: false, payOnline: true });
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
      <h4>CHOOSE PAYMENT FORM</h4>
      <div className="choose">
        <button
          type="submit"
          className={choosePay.payLater ? "active" : ""}
          onClick={() => payLater()}
        >
          Payment on delivery
        </button>
        <button
          type="submit"
          className={choosePay.payOnline ? "active" : ""}
          onClick={() => payOnline()}
        >
          Online payment
        </button>
      </div>
      {choosePay.payLater ? (
        <div className="customer-order">
          <button onClick={SendOrderPayLater}>Đặt hàng</button>
        </div>
      ) : null}
      {choosePay.payOnline ? (
        <button type="submit" className="paypal">
          <VnPay />
        </button>
      ) : null}
    </div>
  );
}

export default Payment;
