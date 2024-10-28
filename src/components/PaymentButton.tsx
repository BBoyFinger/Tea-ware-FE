import React from "react";
import axios from "axios";

const PaymentButton = () => {
  const handlePayment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/payment/create-payment",
        {
          amount: 100000, // Số tiền thanh toán
          orderDescription: "Thanh toán đơn hàng #123",
        }
      );

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        console.error("Không tạo được đơn hàng thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
    }
  };

  return <button onClick={handlePayment}>Thanh toán qua Zalo Pay</button>;
};

export default PaymentButton;
