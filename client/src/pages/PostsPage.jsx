import React, { useState, useEffect } from "react";
import { Post, AddPost } from "../components";

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
    setPosts([
      {
        _id: "1",
        title: "Freelance Web Development Project",
        description:
          "Looking for a freelance web developer to build a responsive website for an e-commerce business.",
        taskTime: "2 weeks",
        taskPayment: "$1500",
        workType: "remote",
        posterId: "user1",
        applicants: ["user2", "user3"],
        status: "open",
        dateCreated: new Date(),
      },
      {
        _id: "2",
        title: "Graphic Design for Social Media Campaign",
        description:
          "Need a graphic designer to create engaging visuals for a social media marketing campaign.",
        taskTime: "1 week",
        taskPayment: "$500",
        workType: "remote",
        posterId: "user2",
        applicants: ["user1", "user3"],
        status: "open",
        dateCreated: new Date(),
      },
    ]);

    // const fetchPosts = async () => {
    //   try {
    //     // const response = await fetch('/api/posts');
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch posts');
    //     }
    //     const data = await response.json();
    //     setPosts(data.posts);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    // fetchPosts();
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
