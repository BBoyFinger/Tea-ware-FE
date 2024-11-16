// components/Comments.tsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FaTrash } from "react-icons/fa";
import { getTimeAgo } from "../utils/timeComment";

// Define types for Comment and Reply
interface Reply {
  _id: string;
  user: {
    _id: string;
    name: string;
    pictureImg: string;
  };
  comment: string;
  likes: number;
  createdAt: Date;
}

interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    pictureImg: string;
  };
  comment: string;
  likes: number;
  replies: Reply[];
  createdAt: Date;
}

interface CommentsProps {
  productId: string;
}

const Comments: React.FC<CommentsProps> = ({ productId }) => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [reply, setReply] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingComment, setAddingComment] = useState<boolean>(false);
  const maxChars = 500;

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/comments/${productId}`);
        setComments(response.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    setComments([]);
    fetchComments();
  }, [productId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Comment field cannot be empty");
      return;
    }

    setAddingComment(true);
    try {
      const response = await axiosInstance.post("/createComment", {
        productId,
        userId: user?._id,
        comment: newComment,
      });
      setComments([...comments, response.data.data]);
      setNewComment("");
      setSuccessMessage("Comment posted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setAddingComment(false);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!reply[commentId]?.trim()) {
      setError("Reply field cannot be empty");
      return;
    }
  
    console.log("Replying to comment:", commentId);
    console.log("Product ID:", productId);
  
    try {
      const response = await axiosInstance.post(`/reply/${commentId}`, {
        userId: user?._id,
        comment: reply[commentId],
      });
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? response.data : comment
        )
      );
      setReply({ ...reply, [commentId]: "" });
      setReplyTo(null);
    } catch (error) {
      console.error("Error replying to comment:", error);
      setError("Failed to post reply. Please try again.");
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/comments/${commentId}/replies/${replyId}`);
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter((reply) => reply._id !== replyId),
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
      setError("Failed to delete reply. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mt-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {loading ? (
        <p>Loading comments...</p>
      ) : (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddComment();
            }}
            className="mb-8 space-y-4"
          >
            <div className="relative">
              <textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={`w-full p-4 border rounded-lg resize-none min-h-[120px] ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                aria-label="Comment Text"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {maxChars - newComment.length} characters remaining
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={addingComment}
            >
              {addingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>

          <div className="space-y-6">
            {comments?.map((comment) => (
              <div
                key={comment._id}
                className="border rounded-lg p-6 space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={`${comment.user?.pictureImg}`}
                    alt={`${comment.user?.name}'s avatar`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{comment.user?.name}</h3>
                      <span className="text-sm text-gray-500">
                        {getTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{comment.comment}</p>
                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        onClick={() => setReplyTo(comment._id)}
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        Reply
                      </button>
                      {(user?._id === comment.user._id ||
                        user?.role === "admin") && (
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                          aria-label="Delete Comment"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {replyTo === comment._id && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Write your reply..."
                      value={reply[comment._id] || ""}
                      onChange={(e) =>
                        setReply({ ...reply, [comment._id]: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg resize-none min-h-[80px] border-gray-300"
                      aria-label="Reply Text"
                    />
                    <button
                      onClick={() => handleReply(comment._id)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Post Reply
                    </button>
                  </div>
                )}

                {comment.replies?.length > 0 && (
                  <div className="ml-12 space-y-4 mt-4 border-l-2 border-gray-200 pl-6">
                    {comment.replies?.map((reply) => (
                      <div
                        key={reply._id}
                        className="flex items-start space-x-4"
                      >
                        <img
                          src={reply.user.pictureImg}
                          alt={`${reply.user.name}'s avatar`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{reply.user.name}</h4>
                            <span className="text-sm text-gray-500">
                              {getTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="mt-2 text-gray-700">{reply.comment}</p>
                          {(user?._id === reply.user._id ||
                            user?.role === "admin") && (
                            <button
                              onClick={() =>
                                handleDeleteReply(comment._id, reply._id)
                              }
                              className="text-gray-500 hover:text-red-500 transition-colors"
                              aria-label="Delete Reply"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;