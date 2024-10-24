import React, { ChangeEvent, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import Table from "../../../components/ui/Table";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { BsSearch } from "react-icons/bs";
import { ImSpinner3 } from "react-icons/im";

type Props = {};

const OrderManagement = (props: Props) => {
  const [selectedOrders, setselectedOrders] = useState<string[]>([]);
  const [searchField, setSearchField] = useState({
    orderNumber: "",
    customerName: "",
    orderDate: "",
    status: "",
  });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleDateRangeChange = (e: any) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const [itemsPerPage, setitemsPerPage] = useState<number>(0);
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: "ORD001",
      customerName: "John Doe",
      status: "Pending",
      total: 150.0,
      date: "2023-06-01",
    },
    {
      id: 2,
      orderNumber: "ORD002",
      customerName: "Jane Smith",
      status: "Shipped",
      total: 250.0,
      date: "2023-06-02",
    },
    {
      id: 3,
      orderNumber: "ORD003",
      customerName: "Bob Johnson",
      status: "Delivered",
      total: 100.0,
      date: "2023-06-03",
    },
  ]);
  const [sortBy, setSortBy] = useState<string>("");
  const orderState = useSelector((state: RootState) => state.orderReducer);
  const { isLoading } = orderState;

  const columns = [
    { key: "orederNumber", label: "Order Number", sortable: true },
    { key: "customerName", label: "Customer Name", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "total", label: "Total", sortable: true },
    { key: "createdAt", label: "Date", sortable: true },
  ];

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setSearchField({ ...searchField, [value]: name });
  };

  function openModal(arg0: null): void {
    throw new Error("Function not implemented.");
  }

  function handleSelectOrder(id: string): void {
    throw new Error("Function not implemented.");
  }

  function handleSort(key: string): void {
    throw new Error("Function not implemented.");
  }

  function handleDeleteOrder(id: string[]): void {
    throw new Error("Function not implemented.");
  }

  function handleDeleteOrderSelected(): void {
    throw new Error("Function not implemented.");
  }
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusFilter = (e: any) => {
    setStatusFilter(e.target.value);
  };
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Orders Management
      </h1>
      {/* Search Field */}
      <div className="max-w-md">
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label
              htmlFor="searchName"
              className="min-w-[100px] text-sm text-left font-medium text-gray-700 mb-1"
            >
              Search Order
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={searchField.customerName}
              onChange={handleSearchInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter name"
            />
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="category"
              className="block min-w-[100px] text-sm text-left font-medium text-gray-700"
            >
              Statuses
            </label>
            <select
              name="category"
              value={searchField.status}
              id="status-select"
              onChange={handleStatusFilter}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="Availability"
              className="block min-w-[100px] text-sm text-left font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateRangeChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <label
              htmlFor="Availability"
              className="block min-w-[100px] text-sm text-left font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateRangeChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>
      {/* Button */}
      <div className="flex items-center justify-end mb-2 gap-4">
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
          <BsSearch className="mr-2" /> Search
        </button>
        <button
          onClick={() => openModal(null)}
          className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
        >
          <FiPlus className="mr-2" /> Add Product
        </button>
      </div>
      {/* Table */}
      <div>
        <Table
          selectedItems={selectedOrders}
          onSelectItem={(id) => handleSelectOrder(id)}
          onSort={handleSort}
          onEdit={(Order) => openModal(Order)}
          onDelete={(id) => handleDeleteOrder(id)}
          onDeleteSelected={handleDeleteOrderSelected}
          itemsPerPage={itemsPerPage}
          sortBy={sortBy}
          columns={columns}
          data={orders}
        />
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center flex-col">
            <ImSpinner3 className="animate-spin w-[40px] h-[40px]" />
            <p className="mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
