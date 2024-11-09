import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaTrash,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../../store/store";

interface SocialLink {
  platform: string;
  url: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  profileImage: string;
  socialLinks: SocialLink[];
  skills: string[];
}

const MyProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 8900",
    address: "Ha Noi Viet Nam",
    bio: "Passionate developer with expertise in React and Web Development",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "twitter", url: "https://twitter.com" },
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "github", url: "https://github.com" },
    ],
    skills: ["React", "JavaScript", "TailwindCSS"],
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-32 bg-purple-300 "></div>
        <div className="px-6 py-8 -mt-16">
          <div className="relative mb-8">
            <img
              src={user?.pictureImg}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={user?.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user?.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={user?.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="tel"
                name="phone"
                value={user?.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
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
