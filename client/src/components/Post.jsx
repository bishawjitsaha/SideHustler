import React from "react";

const Post = ({ post }) => {
  const formatTaskTime = () => {
    const { dateStart, dateEnd, timeStart, timeEnd } = post.taskTime;
    return `${formatDate(dateStart)} - ${formatDate(dateEnd)} | ${formatTime(timeStart)} - ${formatTime(timeEnd)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}:00`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-blue-400 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">{post.title}</h2>

      <p className="text-gray-700 mb-2">{post.description}</p>

      <div className="flex justify-between text-gray-600">
        <p>Task Time: {formatTaskTime()}</p>
        <p>Task Payment: ${post.taskPayment}</p>
      </div>
    </div>
  );
};

export default Post;
