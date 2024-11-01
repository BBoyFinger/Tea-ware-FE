import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const Profile = () => {
  const userDetail = useSelector((state: RootState) => state.authReducer.user);

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main St, City, Country",
    phone: "+1 234 567 890",
    image:
      "images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3",
  });

  const handleProfileUpdate = (field: any, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold mb-6">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={userDetail?.name}
              onChange={(e) => handleProfileUpdate("name", e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={userDetail?.email}
              onChange={(e) => handleProfileUpdate("email", e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={userDetail?.address}
              onChange={(e) => handleProfileUpdate("address", e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={userDetail?.phone}
              onChange={(e) => handleProfileUpdate("phone", e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
              Save Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
