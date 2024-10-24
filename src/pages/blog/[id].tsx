import React, { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { BiLike, BiCommentDetail, BiShareAlt } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { getBlogById } from "../../features/blog/blogSlice";
import moment from "moment";

const BlogDetailsPage = () => {
  const params = useParams();
  const dispatch: AppDispatch = useDispatch();
  const blog = useSelector((state: RootState) => state.blogReducer.blog);
  useEffect(() => {
    if (params.id) {
      dispatch(getBlogById(params.id));
    }
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-500 text-white p-2"
      >
        Skip to main content
      </a>
      <main id="main-content">
        <article className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={blog?.images?.[0]?.url}
            alt={blog?.images?.[0]?.title}
            className="w-full h-64 object-cover object-center"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">
              {blog?.title}
            </h1>
            <div className="flex items-center mb-4">
              <img
                src={blog?.author?.pictureImg}
                alt={blog?.author?.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {blog?.author?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Published on {moment(blog?.createdAt).format("MMM Do YY")}
                </p>
              </div>
            </div>
            <div className="prose max-w-none mb-6">
              <div className="mb-4" dangerouslySetInnerHTML={{ __html: blog?.content || "" }} />
            </div>

            <div className="flex space-x-4 mb-6">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <FaFacebook />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-400">
                <FaTwitter />
                <span>Tweet</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-700">
                <FaLinkedin />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600">
                <FaInstagram />
                <span>Share</span>
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogDetailsPage;
