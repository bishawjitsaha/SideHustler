import React, { useState, useEffect } from "react";
import { Post, AddPost } from "../components";
import axios from "axios";

const PostsPage = () => {
  const [posts, setPosts] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {

    const fetchPosts = async () => {
        try{
            let {data}  = await axios.get(`http://localhost:3000/posts/all`);
            if(data){
                console.log(data)
            }
            setPosts(data.posts);   
        }catch(e){
    
        }
    }
    fetchPosts();
    
}, []);

    useEffect(() => {
      console.log("Post State: ", posts)
  }, [posts]);

    const addPost = async (newPost) => {
        setPosts([...posts, newPost]);
    }
  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white p-2 rounded-lg"
      >
        New Post
      </button>

      {isModalOpen && <AddPost isOpen={isModalOpen} handleClose={handleCloseModal} addPost={addPost} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-gray-300">
        {posts && posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};

export default PostsPage;
