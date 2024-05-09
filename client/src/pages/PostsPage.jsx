import React, { useState, useEffect, useContext } from "react";
import { Post, AddPost } from "../components";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { backendUrl } from '../App';

const PostsPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentUser) {
        setLoading(true);
        return;
      }
      try {
        const response = await axios.get(`${backendUrl}/posts/all`, {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`
          }
        });
        const data = await response.data;
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [currentUser]);

  useEffect(() => {
    console.log("Post State: ", posts);
  }, [posts]);

  const addPost = async (newPost) => {
    setPosts([...posts, newPost]);
  };

  return (
    <>
      <div className="flex justify-start mt-8">
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Create Post
        </button>
      </div>

      {isModalOpen && (
        <AddPost
          isOpen={isModalOpen}
          handleClose={handleCloseModal}
          addPost={addPost}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 bg-gray-200 rounded-lg mx-auto px-auto">
        {posts &&
          posts.map((post) => (
            <div key={post._id} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                <Link to={`/user/${post.posterUsername}`} className="text-teal-500 text-left font-bold text-xl hover:text-teal-200 mb-4">
                    {post.posterUsername}
                </Link>
                <Link to={`/post/${post._id}`} className="transform transition duration-250 ease-in-out hover:scale-105">
                  <Post post={post} status={post.status} />
                </Link> 
            </div>
          ))}
      </div>
    </>
  );
};

export default PostsPage;
