import React from "react";

const Post = ({ post }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">
                    {post.title}
                </h2>

                <p className="text-gray-700 mb-4">{post.description}</p>

            </div>

                <hr className="border-gray-200 my-4" />
            <div className="flex flex-col  justify-center">
                <div className="flex justify-between text-gray-600 mb-2 w-full">
                    <p>
                        Start Date:{" "}
                        {new Date(post.taskTime.dateStart).toLocaleString(
                            "en-US",
                            {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            }
                        )}{" "}
                    </p>
                    <p>Status: {post.status.charAt(0).toUpperCase() + post.status.slice(1)}</p>
                </div>
                <div className="flex justify-between text-gray-600 w-full">
                    <p>
                        Work Type:{" "}
                        {post.workType.charAt(0).toUpperCase() +
                            post.workType.slice(1)}
                    </p>
                    <p>Payment: ${post.taskPayment.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default Post;
