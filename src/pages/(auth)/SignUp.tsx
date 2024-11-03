import { useState } from "react";
import Logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { BsEyeSlashFill } from "react-icons/bs";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { imageToBase64 } from "../../utils/imageTobase64";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const defaultAvatar =
    "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg";

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      pictureImg: defaultAvatar,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const dataRes = await axiosInstance.post("/signup", values);
        if (dataRes.data.success) {
          toast.success(dataRes.data.message);
          navigate("/login");
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    },
  });

  const handleUploadUploadPic = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const imagePic = (await imageToBase64(file)) as string;
      formik.setFieldValue("pictureImg", imagePic);
    }
  };

  return (
    <section id="signup">
      <div className="container bg-white mx-auto max-w-[600px]">
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm relative overflow-hidden">
            <img
              alt="Your Company"
              src={formik.values.pictureImg || Logo}
              className="mx-auto w-40 object-cover rounded-full"
            />
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
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up
        </h2>

        <div className="mt-10 pb-2 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 bg-slate-100 p-1 w-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 bg-slate-100 p-1 w-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}
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
                <div className="cursor-pointer">
                  <span onClick={() => setShowPassword((pre) => !pre)}>
                    {showPassword ? <BsEyeSlashFill /> : <IoEyeSharp />}
                  </span>
                </div>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-1 flex bg-slate-100 p-2 items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  className="h-full w-full outline-none bg-transparent"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                />
                <div className="cursor-pointer">
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <BsEyeSlashFill /> : <IoEyeSharp />}
                  </span>
                </div>
              </div>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#bd3030] text-white p-2 rounded-md"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-10 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-[#bd3030]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
