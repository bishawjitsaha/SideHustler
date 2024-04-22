import React from "react";

const Post = ({ post }) => {
  return (
    <div className="bg-blue-400 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">{post.title}</h2>

      <p className="text-gray-700 mb-2">{post.description}</p>

      <div className="flex justify-between text-gray-600">
        <p>Task Time: {post.taskTime}</p>
        <p>Task Payment: {post.taskPayment}</p>
      </div>
    </div>
  );
};

export default Post;
