import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useFormik } from "formik";
import * as yup from "yup";
import PaymentButton from "../components/PaymentButton";
import { getAllDistricts, getAllProvinces } from "../features/order/orderSlice";

const shippingSchema = yup.object({
  firstName: yup.string().required("First Name is Required!"),
  lastName: yup.string().required("Last Name is Required!"),
  address: yup.string().required("Address Details is Required!"),
  city: yup.string().required("City is Required!"),
  country: yup.string().required("Country is Required!"),
  pinCode: yup.string().required("PinCode is Required!"),
});

type Props = {};

const Checkout = (props: Props) => {
  const authState = useSelector((state: RootState) => state.authReducer);
  const orderState = useSelector((state: RootState) => state.orderReducer);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProvinces());
    dispatch(getAllDistricts(202));
  }, [dispatch]);

  const { provinces, districts, wards } = orderState;

  console.log(provinces);

  const [totalAmount, setTotalAmount] = useState<number>(0);

  const { productsCart, user } = authState;

  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < productsCart?.length; index++) {
      sum +=
        Number(productsCart[index]?.quantity || 0) *
        (productsCart[index]?.productId?.price || 0);
    }
    setTotalAmount(sum);
  }, [productsCart]); // Add productsCart as a dependency

  const validateForm = useFormik({
    initialValues: {
      firstName: "",
      other: "",
      lastName: "",
      address: "",
      state: "",
      city: "",
      country: "",
      pinCode: "",
    },
    validationSchema: shippingSchema,
    onSubmit(values: any) {
      alert(JSON.stringify(values));
    },
  });

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
        <div className="checkout-left mt-6 col-span-2">
          <h3 className="text-2xl font-semibold text-gray-800">Teaware Shop</h3>
          <h4 className="text-xl font-medium text-gray-700 mt-2">
            Contact Information
          </h4>
          <p className="user-details text-lg text-gray-600 mt-1">
            {user?.name}
          </p>
          <PaymentButton />
          <form
            onSubmit={validateForm.handleSubmit}
            action=""
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4"
          >
            {/* Province Selector */}
            <div className="col-span-full lg:col-span-1">
              <select
                name="province"
                onChange={validateForm.handleChange("province")}
                onBlur={validateForm.handleBlur("province")}
                value={validateForm.values.province}
                className="w-full py-2 px-3 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
              >
                <option value="" disabled>
                  Select Province
                </option>
                {/* Add options dynamically based on your data */}
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
              <div className="text-red-500 ms-1 my-1">
                {validateForm.touched.province &&
                  typeof validateForm.errors.province === "string" &&
                  validateForm.errors.province}
              </div>
            </div>

            {/* District Selector */}
            <div className="col-span-full lg:col-span-1">
              <select
                name="district"
                onChange={validateForm.handleChange("district")}
                onBlur={validateForm.handleBlur("district")}
                value={validateForm.values.district}
                className="w-full py-2 px-3 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
              >
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
              <div className="text-red-500 ms-1 my-1">
                {validateForm.touched.district &&
                  typeof validateForm.errors.district === "string" &&
                  validateForm.errors.district}
              </div>
            </div>

            {/* Ward Selector */}
            <div className="col-span-full lg:col-span-1">
              <select
                name="ward"
                onChange={validateForm.handleChange("ward")}
                onBlur={validateForm.handleBlur("ward")}
                value={validateForm.values.ward}
                className="w-full py-2 px-3 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
              >
                <option value="" disabled>
                  Select Ward
                </option>
                {/* Add options dynamically based on your data */}
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>
              <div className="text-red-500 ms-1 my-1">
                {validateForm.touched.ward &&
                  typeof validateForm.errors.ward === "string" &&
                  validateForm.errors.ward}
              </div>
            </div>

            {/* First and Last Name */}
            <div className="flex space-x-4 col-span-full lg:col-span-2">
              <div className="flex-grow">
                <input
                  type="text"
                  name="firstName"
                  className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="First Name"
                  onChange={validateForm.handleChange("firstName")}
                  onBlur={validateForm.handleBlur("firstName")}
                  value={validateForm.values.firstName}
                />
                <div className="text-red-500 ms-1 my-1">
                  {validateForm.touched.firstName &&
                    typeof validateForm.errors.firstName === "string" &&
                    validateForm.errors.firstName}
                </div>
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="Last Name"
                  name="lastName"
                  onChange={validateForm.handleChange("lastName")}
                  onBlur={validateForm.handleBlur("lastName")}
                  value={validateForm.values.lastName}
                />
                <div className="text-red-500 ms-1 my-1">
                  {validateForm.touched.lastName &&
                    typeof validateForm.errors.lastName === "string" &&
                    validateForm.errors.lastName}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="col-span-full">
              <input
                type="text"
                className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                placeholder="Address"
                name="address"
                onChange={validateForm.handleChange("address")}
                onBlur={validateForm.handleBlur("address")}
                value={validateForm.values.address}
              />
              <div className="text-red-500 ms-1 my-1">
                {validateForm.touched.address &&
                  typeof validateForm.errors.address === "string" &&
                  validateForm.errors.address}
              </div>
            </div>

            {/* Apartment */}
            <div className="col-span-full">
              <input
                type="text"
                className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                placeholder="Apartment, suite, etc. (optional)"
                onChange={validateForm.handleChange("other")}
                onBlur={validateForm.handleBlur("other")}
                value={validateForm.values?.other}
              />
            </div>

            {/* City, State, Zipcode */}
            <div className="flex space-x-4 col-span-full lg:col-span-3">
              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="City"
                  name="city"
                  onChange={validateForm.handleChange("city")}
                  onBlur={validateForm.handleBlur("city")}
                  value={validateForm.values.city}
                />
                <div className="text-red-500 ms-1 my-1">
                  {validateForm.touched.city &&
                    typeof validateForm.errors.city === "string" &&
                    validateForm.errors.city}
                </div>
              </div>

              <div className="flex-grow">
                <input
                  type="text"
                  className="w-full py-[3px] px-2 pr-12 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="Zipcode"
                  name="pinCode"
                  onChange={validateForm.handleChange("pinCode")}
                  onBlur={validateForm.handleBlur("pinCode")}
                  value={validateForm.values.pinCode}
                />
                <div className="text-red-500 ms-1 my-1">
                  {validateForm.touched.pinCode &&
                    typeof validateForm.errors.pinCode === "string" &&
                    validateForm.errors.pinCode}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div>
          {productsCart.map((item: any) => {
            return (
              <div className="border-b py-4" key={item._id}>
                <div className="flex items-center justify-between gap-2">
                  {/* Product Image and Badge */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <span className="bg-gray-500 text-white rounded-full px-2 py-1 absolute top-[-10px] right-[-10px] text-sm">
                      {item.quantity}
                    </span>
                    <img
                      src={item.productId.images[0].url}
                      alt={item.productId.images[0].title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="text-gray-800">
                    <h5 className="text-lg font-semibold ">
                      {item.productId.productName}
                    </h5>
                    <p className="text-sm text-gray-600 ">
                      {item.productId.description?.substring(0, 40)} ...
                    </p>
                  </div>

                  {/* Product Price */}
                  <div className="text-right">
                    <h5 className="text-lg font-semibold text-gray-800">
                      {item.productId.price * item.quantity} $
                    </h5>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="border-b py-4">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>{totalAmount}$</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>$ 1000</p>
            </div>
          </div>
          <div className="flex justify-between border-b py-4">
            <h4>Total</h4>
            <h5>{totalAmount + 1000}$</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
