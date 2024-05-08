import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { backendUrl } from '../App';

const Post = ({ post, status}) => {
    
    const [user, setUser] = useState(null);
    const { currentUser } = useContext(AuthContext);
    
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${backendUrl}/user/getById/${post.posterId}`, {
                    headers: {
                        Authorization: `Bearer ${currentUser.accessToken}`
                    }
                });
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        if(!currentUser){
            return;
        }else{
            fetchUser();
        }
    }, [post.posterId]);

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
                <Link key={post._id} to={`/post/${post._id}`}>
                    <h2 className="text-2xl font-bold mb-4 text-blue-700 overflow-ellipsis overflow-hidden">
                        {post.title}
                    </h2>
                </Link>


                <p className="text-gray-700 mb-4">{post.description}</p>
                {post.photos && (
                    <img
                        src={post.photos}
                        alt="Post"
                        className="w-full h-64 object-cover object-center rounded-lg mb-4"
                    />
                )}
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
                    {status &&
                        <p>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
                     } 
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
