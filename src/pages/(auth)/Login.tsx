import React, { useContext, useState } from "react";
import Logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import Context from "../../context";
import { useFormik } from "formik";
import * as Yup from "yup";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const userContext = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<LoginForm>({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address!")
        .required("Email is Required!"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is Required!"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.post("/signin", values);
        if (response?.data.success) {
          // Store the access token in axios headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          
          // Optionally, store the access token in local storage or context if needed
          // localStorage.setItem('accessToken', response.data.accessToken);

          toast.success(response.data.message);
          navigate("/");
          userContext?.fetchUserDetails();
        }
      } catch (error: any) {
        toast.error(error.response?.data.message || 'Login failed');
      }
    },
  });

  return (
    <section id="login">
      <div className="container bg-white mx-auto max-w-[600px]">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src={Logo}
              className="mx-auto w-40 object-cover"
            />
            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
        </div>
        <div className="mt-10 pb-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-1 bg-slate-100 p-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="h-full w-full outline-none bg-transparent"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-1 flex bg-slate-100 p-2 items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  className="h-full w-full outline-none bg-transparent"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <span
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BsEyeSlashFill /> : <IoEyeSharp />}
                </span>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#bd3030] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-[0.9] focus:outline-none"
            >
              Sign In
            </button>
          </form>
          <p className="my-10 text-center text-sm text-gray-500">
            Don't have any account?{" "}
            <Link
              to="/sign-up"
              className="font-semibold leading-6 text-[#bd3030] hover:opacity-[0.9]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;