import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useFormik } from "formik";
import * as yup from "yup";

import {
  getAllDistricts,
  getAllProvinces,
  getAllWards,
} from "../features/order/orderSlice";
import Payment from "../components/order/Payment";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";

const shippingSchema = yup.object({
  fullName: yup.string().required("Full Name is Required!"),
  address: yup.string().required("Address Details is Required!"),
  province: yup.string().required("Province is Required!"),
  district: yup.string().required("District is Required!"),
  ward: yup.string().required("Ward is Required!"),
  phone: yup
    .string()
    .required("Phone number is Required!")
    .matches(/^[0-9]+$/, "Phone number is not valid")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  city: yup.string().required("City is Required!"),
  country: yup.string().required("Country is Required!"),
  pinCode: yup.string().required("PinCode is Required!"),
});

type Props = {};

const Checkout = (props: Props) => {
  const [isVerified, setIsVerified] = useState(true);
  const authState = useSelector((state: RootState) => state.authReducer);
  const orderState = useSelector((state: RootState) => state.orderReducer);
  const dispatch: AppDispatch = useDispatch();

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    dispatch(getAllProvinces());
  }, [dispatch]);

  const { provinces, districts, wards } = orderState;

  const handleProvinceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    dispatch(getAllDistricts(provinceId));
    setSelectedDistrict(""); // Reset district and ward when province changes
    setSelectedWard("");
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    dispatch(getAllWards(districtId)); // Fetch wards based on selected district
    setSelectedWard(""); // Reset ward when district changes
  };

  const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const wardId = event.target.value;
    setSelectedWard(wardId);
  };

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
  }, [productsCart]);

  const validateForm = useFormik({
    initialValues: {
      fullName: user?.name || "", // Use existing user name or empty string
      phone: user?.phone || "", // Use existing user phone or empty string
      address: user?.address || "",
      province: "",
      district: "",
      ward: "",
      other: "",
    },
    validationSchema: shippingSchema,
    async onSubmit(values: any) {
      console.log(JSON.stringify(values));
    },
  });

 

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="checkout-left mt-6 col-span-2">
          <h3 className="text-2xl font-semibold text-gray-800">Teaware Shop</h3>
          <h4 className="text-xl font-medium text-gray-700 mt-2">
            Contact Information
          </h4>
          <p className="user-details text-lg text-gray-600 mt-1">
            {user?.name}
          </p>

          <form
            onSubmit={validateForm.handleSubmit}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4"
          >
            {/* Province Selector */}
            <div className="col-span-full lg:col-span-1">
              <label className="block text-gray-700">Province</label>
              <select
                name="province"
                onChange={(e) => {
                  handleProvinceChange(e);
                  validateForm.handleChange(e);
                }}
                onBlur={validateForm.handleBlur}
                value={validateForm.values.province}
                className="w-full py-2 px-3 pr-12 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
              >
                <option value="" disabled>
                  Select Province
                </option>
                {provinces.map((province: any) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
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
              <label className="block text-gray-700">District</label>
              <select
                name="district"
                onChange={(e) => {
                  handleDistrictChange(e);
                  validateForm.handleChange(e);
                }}
                onBlur={validateForm.handleBlur}
                value={validateForm.values.district}
                className="w-full py-2 px-3 pr-12 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
              >
                <option value="" disabled>
                  Select District
                </option>
                {districts?.map((district: any) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
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
              <label className="block text-gray-700">Ward</label>
              <select
                name="ward"
                onChange={(e) => {
                  handleWardChange(e);
                  validateForm.handleChange(e);
                }}
                onBlur={validateForm.handleBlur}
                value={validateForm.values.ward}
                className="w-full py-2 px-3 pr-12 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
              >
                <option value="" disabled>
                  Select Ward
                </option>
                {wards.map((ward: any) => (
                  <option key={ward.WardID} value={ward.WardID}>
                    {ward.WardName}
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
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="w-full py-2 px-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="Full Name"
                  onChange={validateForm.handleChange}
                  onBlur={validateForm.handleBlur}
                  value={validateForm.values.fullName} // Use formik value
                />
                <div className="text-red-500 ms-1 my-1">
                  {validateForm.touched.fullName &&
                    typeof validateForm.errors.fullName === "string" &&
                    validateForm.errors.fullName}
                </div>
              </div>

              <div className="flex-grow">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  className="w-full py-2 px-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                  placeholder="Phone Number"
                  name="phone"
                  onChange={validateForm.handleChange}
                  onBlur={validateForm.handleBlur}
                  value={validateForm.values.phone} // Use formik value
                />
                <div className="text-red-500 ms-1 my-1">
                  {validateForm.touched.phone &&
                    typeof validateForm.errors.phone === "string" &&
                    validateForm.errors.phone}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="col-span-full">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                className="w-full py-2 px-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                placeholder="Address"
                name="address"
                onChange={validateForm.handleChange}
                onBlur={validateForm.handleBlur}
                value={validateForm.values.address}
              />
              <div className="text-red-500 ms-1 my-1">
                {validateForm.touched.address &&
                  typeof validateForm.errors.address === "string" &&
                  validateForm.errors.address}
              </div>
            </div>

            {/* Phone Number */}

            {/* Apartment */}
            <div className="col-span-full">
              <label className="block text-gray-700">
                Apartment, suite, etc. (optional)
              </label>
              <input
                type="text"
                name="other"
                className="w-full py-2 px-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out shadow-sm"
                placeholder="Apartment, suite, etc. (optional)"
                onChange={validateForm.handleChange}
                onBlur={validateForm.handleBlur}
                value={validateForm.values?.other}
              />
            </div>
            <div className="flex col-span-full gap-4 justify-between">
              <Link to={"/cart"} className="flex items-center gap-3">
                <BiArrowBack /> Continute Shopping
              </Link>
              <Payment isVerified={isVerified} />
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
