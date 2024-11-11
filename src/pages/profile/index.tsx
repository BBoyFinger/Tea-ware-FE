import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppDispatch, RootState } from "../../store/store";
import { updateUser } from "../../features/auth/authSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { imageToBase64 } from "../../utils/imageTobase64"; // Import the utility function

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
}

const MyProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const dispatch: AppDispatch = useDispatch();

  const formik = useFormik<ProfileData>({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      profileImage: user?.pictureImg || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(
          updateUser({
            userId: user?._id,
            phone: values.phone,
            address: values.address,
            email: values.email,
            name: values.name,
            pictureImg: values.profileImage,
          })
        ).unwrap();
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile!");
      }
    },
  });

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageBase64 = await imageToBase64(file);
      formik.setFieldValue("profileImage", imageBase64);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-32 bg-purple-300 "></div>
        <div className="px-6 py-8 -mt-16">
          <div className="relative mb-8">
            <img
              src={formik.values.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
              id="profile-image"
              accept="image/*"
            />
            <label
              htmlFor="profile-image"
              className="block text-center mt-2 text-sm text-blue-600 cursor-pointer hover:text-blue-800"
            >
              Change Photo
            </label>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.address}
                </div>
              ) : null}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyProfile;
