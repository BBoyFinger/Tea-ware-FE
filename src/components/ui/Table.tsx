import moment from "moment";
import { FaTrash } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Pagination from "./Pagination";
import { useState } from "react";

interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
  render?: (item: any) => React.ReactNode;
  isAction?: boolean;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  sortBy: string;
  sortOrder?: "asc" | "desc";
  selectedItems: string[];
  onSort: (key: string) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string[]) => void;
  onDeleteSelected: () => void;
  onSelectItem: (id: string) => void;
  itemsPerPage: number;
}

function Table({
  columns,
  data,
  sortBy,
  sortOrder,
  selectedItems,
  onSort,
  onEdit,
  onDelete,
  onDeleteSelected,
  onSelectItem,
  itemsPerPage,
}: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Tính toán chỉ số mục đầu tiên và cuối cùng
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lấy danh sách các mục hiện tại
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Hàm phân trang
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Select
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && onSort(column.key)}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.sortable ? "cursor-pointer" : ""
                }`}
              >
                {column.label}{" "}
                {sortBy === column.key && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data?.map((item: any) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => onSelectItem(item._id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </td>
              {columns.map((column) => (
                <td
                  key={`${column.key}-${item.id}`}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {column.key === "createdAt" ? (
                    moment(item[column.key]).format("DD/MM/YYYY")
                  ) : column.key === "status" ? (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  ) : column.key === "pictureImg" ? (
                    <img
                      src={item.pictureImg}
                      alt={item.name}
                      className="w-14 h-14 rounded-full"
                    />
                  ) : column.key === "images" ? (
                    <img
                      src={item.images[0]?.url}
                      alt=""
                      className="w-20 h-20"
                    />
                  ) : column.key === "category" ? (
                    item.category?.name
                  ) : column.key === "isFeatured" ? (
                    <>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.isFeatured}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </>
                  ) : column.key === "description" ? (
                    <span title={item[column.key]}>
                      {item[column.key]?.substring(0, 50)} ...
                    </span>
                  ) : column.key === "title" ? (
                    <span title={item[column.key]}>
                      {item[column.key]?.substring(0, 20)} ...
                    </span>
                  ) : column.key === "content" ? (
                    <span title={item[column.key]}>
                      {item[column.key]?.substring(0, 50)} ...
                    </span>
                  ) : (
                    item[column.key]
                  )}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}

      {/* <Pagination
        currentPage={currentPage}
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        onPageChange={paginate}
      /> */}
      {selectedItems.length > 0 && onDeleteSelected && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onDeleteSelected}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <FaTrash className="mr-2" /> Delete Selected
          </button>
        </div>
      )}
    </div>
  );
}

export default Table;
