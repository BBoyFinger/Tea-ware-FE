import { useState } from "react";
import Logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { imageToBase64 } from "../../utils/imageTobase64";

type Props = {};

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  pictureImg: string;
}

const SignUp = (props: Props) => {
  const navigate = useNavigate();
  const defaultAvatar =
    "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg";
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [data, setData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pictureImg: defaultAvatar,
  });

  const handleUploadUploadPic = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const imagePic = (await imageToBase64(file)) as string;
      setData((pre) => ({
        ...pre,
        pictureImg: imagePic,
      }));
    }
  };

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
      if (data.password === data.confirmPassword) {
        const dataRes = await axiosInstance.post("/signup", data);

        if (dataRes.data.success) {
          toast.success(dataRes.data.message);
          navigate("/login");
        }
      } else {
        toast.error("Please check password and confirm password!");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section id="signup">
      <div className="container bg-white mx-auto max-w-[600px]">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm relative overflow-hidden">
            <div>
              <img
                alt="Your Company"
                src={data.pictureImg || Logo}
                className="mx-auto w-40 object-cover rounded-full"
              />
            </div>
            <form>
              <label>
                <div className="text-xs bg-slate-300/20 py-4 text-center absolute bottom-0 left-[38%] cursor-pointer rounded-full p-2">
                  Upload photo
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUploadUploadPic}
                />
              </label>
            </form>
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up
        </h2>

        <div className="mt-10 pb-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            method="POST"
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Your Name
              </label>
              <div className="mt-1 bg-slate-100 p-2">
                <input
                  type="name"
                  name="name"
                  id="name"
                  required
                  autoComplete="name"
                  className="h-full w-full outline-none bg-transparent"
                  value={data.name}
                  onChange={handleOnchange}
                />
              </div>
            </div>
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-1 flex bg-slate-100 p-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnchange}
                  required
                  autoComplete="confirmPassword"
                  className="h-full w-full outline-none bg-transparent"
                />
                <div className="cursor-pointer">
                  <span onClick={() => setShowConfirmPassword((pre) => !pre)}>
                    {showConfirmPassword ? <BsEyeSlashFill /> : <IoEyeSharp />}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#bd3030] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-[0.9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="my-10 text-center text-sm text-gray-500">
            Already have account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-[#bd3030] hover:opacity-[0.9]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
