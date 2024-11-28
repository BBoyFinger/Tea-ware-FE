import React, { useState, useEffect } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import { searchBlog } from "../../features/blog/blogSlice";
import scrollTop from "../../utils/scrollTop";

interface Post {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  image: string;
}

const BlogPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const blogState = useSelector((state: RootState) => state.blogReducer);
  const { blogs, searchBlogs } = blogState;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
    dispatch(searchBlog(searchQuery));
  }, [searchQuery]);

  const fetchPosts = async () => {
    setLoading(true);
    // Simulating API call

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSearch = (query: any) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Blog</h1>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full p-2 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search blogs"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchBlogs.map((blog: any) => (
            <div
              key={blog?._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl"
            >
              <img
                src={blog?.images?.[0]?.url}
                alt={blog?.images?.[0]?.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
                <p
                  className="text-gray-600 mb-4"
                  dangerouslySetInnerHTML={{__html: blog.content?.substring(0, 100)}}
                ></p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    {moment(blog.createdAt).format("MMM Do YY")}
                  </span>
                </div>
                <Link
                  to={`${blog._id}`}
                  className="w-full bg-[#f05338] hover:bg-[#f03838] px-3 py-2 text-white rounded-lg "
                  onClick={scrollTop}
                >
                  View Details blog
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={fetchPosts}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          aria-label="Load more posts"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default BlogPage;
