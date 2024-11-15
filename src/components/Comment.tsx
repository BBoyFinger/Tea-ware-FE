// components/Comments.tsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  FaUser,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
  FaFlag,
} from "react-icons/fa";

// Define types for Comment and Reply
interface Reply {
  _id: string;
  user: {
    name: string;
    avatar: string;
  };
  comment: string;
  likes: number;
  createdAt: Date;
}

interface Comment {
  _id: string;
  user: {
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
  const maxChars = 500;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/comments/${productId}`);
        setComments(response.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [productId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Comment field cannot be empty");
      return;
    }

    setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!reply[commentId]?.trim()) {
      setError("Reply field cannot be empty");
      return;
    }

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
    } catch (error) {
      console.error("Error replying to comment:", error);
      setError("Failed to post reply. Please try again.");
    }
  };

  const handleLike = (
    commentId: string,
    isReply = false,
    parentId: string | null = null
  ) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) => {
          if (comment._id === parentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply._id === commentId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              ),
            };
          }
          return comment;
        })
      );
    } else {
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    }
  };

  console.log(comments[0])

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(timestamp).getTime()) / 1000
    );
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

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
        >
          {replyTo ? "Reply" : "Post Comment"}
        </button>
      </form>

      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment._id} className="border rounded-lg p-6 space-y-4">
            
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
                    onClick={() => handleLike(comment._id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Like Comment"
                  >
                    {comment.likes > 0 ? <FaHeart /> : <FaRegHeart />}
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => setReplyTo(comment._id)}
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    Reply
                  </button>
                  <button
                    className="text-gray-500 hover:text-yellow-500 transition-colors"
                    aria-label="Report Comment"
                  >
                    <FaFlag />
                  </button>
                </div>
              </div>
            </div>

            {comment.replies?.length > 0 && (
              <div className="ml-12 space-y-4 mt-4 border-l-2 border-gray-200 pl-6">
                {comment.replies?.map((reply) => (
                  <div key={reply._id} className="flex items-start space-x-4">
                    <img
                      src={`https://${reply.user.avatar}`}
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
                      <div className="mt-4 flex items-center space-x-4">
                        <button
                          onClick={() =>
                            handleLike(reply._id, true, comment._id)
                          }
                          className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                          aria-label="Like Reply"
                        >
                          {reply.likes > 0 ? <FaHeart /> : <FaRegHeart />}
                          <span>{reply.likes}</span>
                        </button>
                        <button
                          className="text-gray-500 hover:text-yellow-500 transition-colors"
                          aria-label="Report Reply"
                        >
                          <FaFlag />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
