import React, { useContext, useState } from "react";
import Logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import Context from "../../context";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const userContext = useContext(Context);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [data, setData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/signin", data);
      console.log(response);
     
      if (response?.data.success) {
        toast.success(response?.data.message);
        navigate("/")
        userContext?.fetchUserDetails();
      }

      
    } catch (error: any) {
      toast.error(error.response?.data.message);
    }
  };

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
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="">
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
                  required
                  autoComplete="email"
                  className="h-full w-full outline-none bg-transparent"
                  value={data.email}
                  onChange={handleOnchange}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-[#bd3030] hover:opacity-[0.9]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-1 flex bg-slate-100 p-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={data.password}
                  onChange={handleOnchange}
                  required
                  autoComplete="password"
                  className="h-full w-full outline-none bg-transparent"
                />
                <div className="cursor-pointer">
                  <span onClick={() => setShowPassword((pre) => !pre)}>
                    {showPassword ? <BsEyeSlashFill /> : <IoEyeSharp />}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#bd3030] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-[0.9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign In
              </button>
            </div>
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
