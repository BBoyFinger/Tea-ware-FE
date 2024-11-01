const SettingsSection = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Password</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Update Password
        </button>
      </form>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded text-blue-500" />
          <span>Order updates</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded text-blue-500" />
          <span>Newsletter</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="checkbox" className="rounded text-blue-500" />
          <span>Promotional emails</span>
        </label>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Social Accounts</h3>
      <div className="space-y-4">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <FaGoogle className="text-red-500" />
          <span>Connect with Google</span>
        </button>
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          <FaFacebook className="text-blue-600" />
          <span>Connect with Facebook</span>
        </button>
      </div>
    </div>

    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
      <button
        onClick={() => setShowDeleteModal(true)}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Delete Account
      </button>
    </div>
  </div>
);

export default SettingsSection;
