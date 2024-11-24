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
          `http://localhost:8080/api/vnpay_return${query}`
        );
      } catch (error) {
        console.error("Error fetching VNPay result:", error);
      }
    };

    getResultVNPay();
  }, [location.search]);

  return (
    <section id="order-success" className="relative h-screen w-full">
      <div className="container mx-auto flex flex-col justify-center items-center h-full">
        <span className="text-limegreen text-4xl w-12 h-12 rounded-full border-3 border-limegreen flex justify-center items-center">
          <AiOutlineCheck size={32} />
        </span>
        <p className="mt-2 mb-5 text-2xl font-semibold">Order Success!</p>
        <div className="flex">
          <Link
            to="/myOrder"
            className="btn text-lg border border-gray-300 px-5 py-2 text-gray-800 rounded-lg mr-4 hover:bg-gray-300 transition"
          >
            Review your order
          </Link>
          <Link
            to="/"
            className="btn text-lg border border-gray-300 px-5 py-2 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VnPaySuccess;
