// components/CommentSection.tsx
import React, { useState } from "react";
import { FaHeart, FaFlag, FaRegHeart, FaSmile } from "react-icons/fa";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

// Define types for User, Reply, and Comment
interface User {
  name: string;
  email: string;
  avatar: string;
}

interface Reply {
  id: number;
  user: User;
  text: string;
  timestamp: Date;
  likes: number;
}

interface Comment {
  id: number;
  user: User;
  text: string;
  timestamp: Date;
  likes: number;
  replies: Reply[];
}

const CommentSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: {
        name: "John Doe",
        email: "john@example.com",
        avatar: "images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      },
      text: "This product is amazing! Highly recommended.",
      timestamp: new Date(Date.now() - 3600000),
      likes: 5,
      replies: [
        {
          id: 2,
          user: {
            name: "Jane Smith",
            email: "jane@example.com",
            avatar: "images.unsplash.com/photo-1438761681033-6461ffad8d80",
          },
          text: "I completely agree with you!",
          timestamp: new Date(Date.now() - 1800000),
          likes: 2,
        },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const maxChars = 500;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!newComment.trim()) newErrors.comment = "Comment is required";
    if (newComment.length > maxChars) newErrors.comment = "Comment is too long";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newCommentObj: Comment = {
      id: Date.now(),
      user: {
        name,
        email,
        avatar: `images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}`,
      },
      text: newComment,
      timestamp: new Date(),
      likes: 0,
      replies: [],
    };

    if (replyTo !== null) {
      setComments(
        comments.map((comment) => {
          if (comment.id === replyTo) {
            return {
              ...comment,
              replies: [...comment.replies, newCommentObj],
            };
          }
          return comment;
        })
      );
      setReplyTo(null);
    } else {
      setComments([...comments, newCommentObj]);
    }

    setNewComment("");
    setShowEmojiPicker(false);
  };

  const handleLike = (
    commentId: number,
    isReply = false,
    parentId: number | null = null
  ) => {
    if (isReply && parentId !== null) {
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
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
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
    }
  };

  const getTimeAgo = (timestamp: Date): string => {
    const seconds = Math.floor(
      (new Date().getTime() - timestamp.getTime()) / 1000
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

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="relative">
          <textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`w-full p-4 border rounded-lg resize-none min-h-[120px] ${
              errors.comment ? "border-red-500" : "border-gray-300"
            }`}
            aria-label="Comment Text"
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
          )}

          <div className="absolute bottom-4 right-4 flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Add Emoji"
            >
              <FaSmile className="text-xl" />
            </button>
            <span className="text-sm text-gray-500">
              {maxChars - newComment.length} characters remaining
            </span>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2">
              <EmojiPicker
                onEmojiClick={(emojiObject: EmojiClickData) => {
                  setNewComment(newComment + emojiObject.emoji);
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {replyTo ? "Reply" : "Post Comment"}
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src={`https://${comment.user.avatar}`}
                alt={`${comment.user.name}'s avatar`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{comment.user.name}</h3>
                  <span className="text-sm text-gray-500">
                    {getTimeAgo(comment.timestamp)}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{comment.text}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Like Comment"
                  >
                    {comment.likes > 0 ? <FaHeart /> : <FaRegHeart />}
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => setReplyTo(comment.id)}
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

            {comment.replies.length > 0 && (
              <div className="ml-12 space-y-4 mt-4 border-l-2 border-gray-200 pl-6">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start space-x-4">
                    <img
                      src={`https://${reply.user.avatar}`}
                      alt={`${reply.user.name}'s avatar`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{reply.user.name}</h4>
                        <span className="text-sm text-gray-500">
                          {getTimeAgo(reply.timestamp)}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{reply.text}</p>
                      <div className="mt-4 flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(reply.id, true, comment.id)}
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

export default CommentSection;
