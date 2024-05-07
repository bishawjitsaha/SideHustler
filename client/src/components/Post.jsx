import React, { useEffect } from "react";
import { useState } from "react";

const Post = ({ post, status }) => {

  const [curStatus, setCurStatus] = useState(status);

  useEffect(() => {
    setCurStatus(status);
  }, [status]);

  return (
    <div className="bg-blue-400 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">{post.title}</h2>

      <p className="text-gray-700 mb-2">{post.description}</p>

      <div className="flex justify-between text-gray-600">
        <p>
          Start Date:{" "}
          {new Date(post.taskTime.dateStart).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}{" "}
        </p>
        <p>
          Work Type:{" "}
          {post.workType.charAt(0).toUpperCase() + post.workType.slice(1)}
        </p>
      </div>
      <div className="flex justify-between text-gray-600">
        <p>Status: {curStatus}</p>
        <p>Payment: ${post.taskPayment}</p>
      </div>
    </div>
  );
};

export default Post;
