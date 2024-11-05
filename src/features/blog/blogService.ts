import { IBlog } from "../../types/blog.type";
import axiosInstance from "../../utils/axiosConfig";

const getBlogs = async (query: string) => {
  const params = new URLSearchParams(query);

  const response = await axiosInstance.get("/blogs", {
    params: params,
  });
  return response.data.data;
};

const searchBlog = async (query: string) => {
  const response = await axiosInstance.get("/blogs/search", {
    params: { query },
  });
  return response.data.data;
};

const getBlogById = async (id: string) => {
  const response = await axiosInstance.get(`/blog/${id}`);
  return response.data.data;
};

const createBlog = async (data: IBlog) => {
  const response = await axiosInstance.post("/blog", data);
  return response.data.data;
};

const editBlog = async (data: IBlog) => {
  const response = await axiosInstance.put(`/blog/${data._id}`, {
    title: data.title,
    content: data.content,
  });
  return response.data.data;
};

const deleteBlog = async (ids: string[]) => {
  const response = await axiosInstance.delete("/blogs", {
    data: { ids: ids },
  });
  return response.data.data;
};

export const BlogService = {
  getBlogs,
  createBlog,
  editBlog,
  deleteBlog,
  searchBlog,
  getBlogById,
};
