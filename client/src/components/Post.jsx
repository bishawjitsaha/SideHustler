import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const Post = ({ post, status }) => {
    
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/user/getById/${post.posterId}`);
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [post.posterId]);

  
  const [curStatus, setCurStatus] = useState(status);

  useEffect(() => {
    setCurStatus(status);
  }, [status]);

  return (
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div>
                <div className="flex justify-start items-center mb-4">
                    {user &&   
                        <Link 
                            to={`/user/${user.userName}`} 
                            className="text-teal-500 text-left font-bold text-xl hover:text-teal-200"
                        >
                            {user.userName}
                        </Link>
                    }
                </div>
                <h2 className="text-2xl font-bold mb-4 text-blue-700">
                    {post.title}
                </h2>


                <p className="text-gray-700 mb-4">{post.description}</p>
                {post.photos !== "" && <img src={post.photos} alt="post Image" className="mb-4 h-48 mx-auto" />}

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
                    <p>Status: {curStatus.charAt(0).toUpperCase() + curStatus.slice(1)}</p>
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
