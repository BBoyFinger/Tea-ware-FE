import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { ImSpinner3 } from "react-icons/im";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getAllUser,
  deleteUsers,
  updateUser,
  setSearchField,
  searchUser,
} from "../../../features/auth/authSlice";
import { toast } from "react-toastify";
import { Modal } from "../../../components/ui/Modal";
import { Account, ROLE } from "../../../utils/User";
import Table from "../../../components/ui/Table";
import { BsSearch } from "react-icons/bs";

type Props = {};

const UserManagement = (props: Props) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState("name");

  const dispatch: AppDispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.authReducer);
  const { users, isLoading, searchField } = userState;

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      role: "ADMIN",
      userId: "",
      status: "Active",
    },
    validationSchema: Yup.object({
      role: Yup.string().required("Role is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(
          updateUser({
            userId: values.userId,
            role: values.role,
            status: values.status,
          })
        ).unwrap();
        toast.success("Updated user role successfully!");
        setIsEditDialogOpen(false);
        dispatch(getAllUser());
      } catch (error) {
        toast.error("Failed to update user role!");
      }
    },
  });

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    dispatch(setSearchField({ [name]: value }));
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSearch = () => {
    dispatch(searchUser(searchField));
  };

  const handleEditUser = (user: any) => {
    formik.setValues({
      email: user.email,
      name: user.name,
      role: user.role,
      userId: user._id,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (ids: string[]) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUsers(ids));
      toast.success("Delete User successfully!");
      dispatch(getAllUser());
    }
  };

  const handleDeleteUserSelected = async () => {
    if (window.confirm("Are you sure you want to delete the selected users?")) {
      await dispatch(deleteUsers(selectedUsers));
      toast.success("Delete User successfully!");
      dispatch(getAllUser());
    }
  };

  const columns = [
    { key: "pictureImg", label: "Avatar", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "status", label: "Activate", sortable: true },
    { key: "createdAt", label: "Created Date", sortable: true },
  ];

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-3xl font-bold mb-6">Users</h3>
        <div className="max-w-md">
          <div className="mb-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label
                htmlFor="searchName"
                className="min-w-[40px] text-sm text-right font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="searchName"
                name="name"
                value={searchField?.name}
                onChange={handleInputChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter name"
              />
            </div>
            <div className="flex items-center gap-4">
              <label
                htmlFor="searchEmail"
                className="min-w-[40px] block text-right text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="searchEmail"
                name="email"
                value={searchField.email}
                onChange={handleInputChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter email"
              />
            </div>
            <div className="flex items-center gap-4">
              <label
                htmlFor="Role"
                className="block min-w-[40px] text-sm text-right font-medium text-gray-700"
              >
                Role
              </label>
              <select
                name="role"
                value={searchField.role}
                id="role-select"
                onChange={handleInputChange}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                {Object.values(ROLE).map((el) => (
                  <option value={el} key={el} className="text-sm">
                    {el}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mb-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            onClick={handleSearch}
          >
            <BsSearch className="mr-2" /> Search
          </button>
        </div>
        <div>
          <Table
            selectedItems={selectedUsers}
            onSelectItem={handleSelectUser}
            onSort={handleSort}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onDeleteSelected={handleDeleteUserSelected}
            itemsPerPage={users.length}
            sortBy={sortBy}
            sortOrder={sortOrder}
            columns={columns}
            data={users}
          />
        </div>
        <Modal
          isOpen={isEditDialogOpen}
          closeModal={() => setIsEditDialogOpen(false)}
          title="Change User Role"
          onSubmit={formik.handleSubmit}
          submitText="Save"
          cancelText="Cancel"
        >
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                value={formik.values.name}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="Email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                value={formik.values.email}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            </div>
            <div className="mb-4 flex gap-4 items-center justify-between">
              <label
                htmlFor="Role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(ROLE).map((el) => (
                  <option value={el} key={el} className="text-sm">
                    {el}
                  </option>
                ))}
              </select>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.values(Account).map((el) => (
                  <option value={el} key={el} className="text-sm">
                    {el}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </Modal>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center flex-col">
            <ImSpinner3 className="animate-spin w-[40px] h-[40px]" />
            <p className="mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;
