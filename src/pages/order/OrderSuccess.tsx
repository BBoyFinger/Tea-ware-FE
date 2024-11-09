import axios from "axios";
import React, { useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const VnPaySuccess: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const getResultVNPay = async () => {
      try {
        const query = location.search;
        const { data } = await axios.get(
          `http://localhost:5555/api/payment/vnpay_return${query}`
        );
        // Handle the response data if needed
        console.log(data);
      } catch (error) {
        console.error("Error fetching VNPay result:", error);
      }
    };

    getResultVNPay();
  }, [location.search]);

  return (
    <section id="order-success">
      <div className="order-success">
        <img src="/images/noproduct.webp" alt="No Product" />

        <span>
          <AiOutlineCheck size={32} />
        </span>
        <p>Order Success!</p>
        <div className="links">
          <Link to="/myOrder" className="btn">
            Review your order
          </Link>
          <Link to="/" className="btn">
            Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VnPaySuccess;