import React, { useState, useEffect, useContext } from "react";
import { Post, AddPost } from "../components";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
      if(!currentUser){
        setLoading(true);
        return;
      }
      try {
        const response = await axios.get("https://sidehustler-backend.onrender.com/posts/all", {
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
            // <Link key={post._id} to={`/post/${post._id}`}>
              <Post post={post} status={post.status} key={post._id}/>
            // </Link>
          ))}
      </div>
    </>
  );
};

export default PostsPage;
