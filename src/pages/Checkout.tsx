import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import hopquateet from "../../src/assets/logo.svg";

type Props = {};

const Checkout = (props: Props) => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="checkout-left mt-6">
          <h3 className="text-2xl font-semibold text-gray-800">Teaware Shop</h3>
          <h4 className="text-xl font-medium text-gray-700 mt-2">
            Contact Information
          </h4>
          <p className="user-details text-lg text-gray-600 mt-1">
            Nguyen Van Hiep
          </p>
          <form
            action=""
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4"
          >
            {/* Country Selector */}
            <div className="col-span-full lg:col-span-1">
              <select className="w-full py-2 px-3 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm">
                <option value="" selected disabled>
                  Select Country
                </option>
              </select>
            </div>

            {/* First and Last Name */}
            <div className="flex space-x-4 col-span-full lg:col-span-2">
              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="First Name"
                />
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Address */}
            <div className="col-span-full">
              <input
                type="text"
                className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                placeholder="Address"
              />
            </div>

            {/* Apartment */}
            <div className="col-span-full">
              <input
                type="text"
                className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>

            {/* City, State, Zipcode */}
            <div className="flex space-x-4 col-span-full lg:col-span-3">
              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="City"
                />
              </div>
              <div className="flex-grow">
                <select
                  name="text"
                  className="w-full py-2 px-3 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                >
                  <option value="" selected disabled>
                    Select State
                  </option>
                </select>
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="Zipcode"
                />
              </div>
            </div>
          </form>
          <div className="w-full mt-4">
            <div className="flex justify-between items-center">
              <Link to="/cart" className="flex items-center gap-[2px]">
                <BiArrowBack />
                Return to Cart
              </Link>
              <Link
                to="/cart"
                className="bg-[#f05338] p-2 rounded-full text-white"
              >
                Continute to Shipping
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="border-b py-4">
            <div className="flex gap-4 items-center justify-between">
              <div className="flex items-center  gap-4">
                {/* Product Image and Badge */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <span className="bg-gray-500 text-white rounded-full px-2 py-1 absolute top-[-10px] right-0 text-sm">
                    1
                  </span>
                  <img
                    src={hopquateet}
                    alt="product"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Product Details */}
                <div className="text-gray-800">
                  <h5 className="text-lg font-semibold">This is product</h5>
                  <p className="text-sm text-gray-600">Hello world</p>
                </div>

                {/* Product Price */}
                <div className="text-right">
                  <h5 className="text-lg font-semibold text-gray-800">$100</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="border-b py-4">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>$ 1000</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>$ 1000</p>
            </div>
          </div>
          <div className="flex justify-between border-b py-4">
            <h4>Total</h4>
            <h5>$ 1000</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
