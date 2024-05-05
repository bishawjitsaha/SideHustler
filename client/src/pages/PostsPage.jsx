import React, { useState, useEffect } from "react";
import { Post, AddPost } from "../components";
import axios from "axios";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts/all");
        const data = await response.data;
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();

  }, []);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white p-2 rounded-lg"
      >
        New Post
      </button>

      {isModalOpen && <AddPost isOpen={isModalOpen} handleClose={handleCloseModal} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-gray-300">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};

export default PostsPage;
