/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import Table from "../../../components/ui/Table";
import { IBlog } from "../../../types/blog.type";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Modal } from "../../../components/ui/Modal";
import { FaTimes, FaUpload } from "react-icons/fa";
import { uploadImageBlog } from "../../../utils/uploadImage";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  createBlog,
  deleteBlog,
  getBlog,
  searchBlog,
  updateBlog,
} from "../../../features/blog/blogSlice";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BsSearch } from "react-icons/bs";

const BlogManagement = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const blogState = useSelector((state: RootState) => state.blogReducer);
  const { blogs, searchBlogs } = blogState;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [UploadImageInput, setUploadImageInput] = useState("");

  const formik = useFormik<IBlog>({
    initialValues: {
      _id: "",
      title: "",
      content: "",
      images: [],
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
    }),
    onSubmit: async (values) => {
      if (values._id) {
        await dispatch(updateBlog(values));
        toast.success("Update blog successfully!");
      } else {
        await dispatch(createBlog(values));
        toast.success("Create blog successfully!");
      }
      setIsModalOpen(false);
      await dispatch(getBlog());
    },
  });

  useEffect(() => {
    dispatch(getBlog()); // Initial fetch of blogs
  }, [dispatch]);

  useEffect(() => {
    dispatch(searchBlog(searchQuery));
  }, [searchQuery, dispatch]);

  const handleDelete = async (id: string[]) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await dispatch(deleteBlog(id));
      toast.success("Delete blog successfully");
      await dispatch(getBlog());
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedBlog((prev) =>
      prev.includes(id) ? prev.filter((blogId) => blogId !== id) : [...prev, id]
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (blog: IBlog | null = null) => {
    if (blog) {
      formik.setValues(blog);
    } else {
      formik.resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSearch = async () => {
    // const payload = {
    //   blog: searchBlogs.,
    //   category: searchField?.category,
    //   availability: searchField.availability,
    // };
    // await dispatch(getProducts(payload));
  };

  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "content", label: "Content", sortable: true },
  ];

  const handleSort = () => {};

  const handleDeletedItem = async () => {
    if (window.confirm("Are you sure you want to delete the selected blog?")) {
      await dispatch(deleteBlog(selectedBlog));
      toast.success("Delete Blog successfully!");
      await dispatch(getBlog());
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadImageInput(file.name);

    const uploadImageFormCloudinary = await uploadImageBlog(file);

    formik.setFieldValue("images", [
      { url: uploadImageFormCloudinary.url, title: file.name },
    ]);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Blogs Management
      </h1>

      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Blogs"
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            // onChange={(e) => handleSearch(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex gap-4">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            onClick={handleSearch}
          >
            <BsSearch className="mr-2" /> Search
          </button>
          <button
            onClick={() => openModal(null)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <FiPlus className="mr-2" /> Add Blog
          </button>
        </div>
      </div>

      <Table
        selectedItems={selectedBlog}
        onSelectItem={handleSelectItem}
        onDeleteSelected={handleDeletedItem}
        columns={columns}
        data={blogs}
        sortBy={"sortBy"}
        sortOrder={"asc"}
        itemsPerPage={20}
        onSort={handleSort}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title={`${formik.values._id ? "Edit Blog" : "Create Blog"}`}
        onSubmit={formik.handleSubmit}
        submitText={`${formik.values._id ? "Edit Blog" : "Create Blog"}`}
        cancelText="Cancel"
        className={
          "inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl overflow-y-auto max-h-[90vh]"
        }
      >
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter blog title"
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <ReactQuill
              theme="snow"
              id="content"
              value={formik.values.content}
              onChange={(value) => formik.setFieldValue("content", value)}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline"],
                  [{ align: [] }],
                  ["link", "image"],
                ],
              }}
              formats={[
                "header",
                "font",
                "list",
                "bold",
                "italic",
                "underline",
                "align",
                "link",
                "image",
              ]}
            />
            {formik.touched.content && formik.errors.content ? (
              <div className="text-red-500 text-sm">
                {formik.errors.content}
              </div>
            ) : null}
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload images</span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {formik.values.images?.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`Uploaded image ${image.title}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      formik.setFieldValue(
                        "images",
                        formik.values.images?.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BlogManagement;
