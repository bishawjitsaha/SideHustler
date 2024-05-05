import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Post } from "../components";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PostPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplicant, setIsApplicant] = useState(false);
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/posts/${id}`);

        if (response.status === 200) {
          const fetchedPost = response.data.post;
          setPost(fetchedPost);

          const currentUserIsApplicant =
            currentUser && fetchedPost && fetchedPost.applicants.includes(currentUser.uid);

          setIsApplicant(currentUserIsApplicant);
          setLoading(false);
        } else {
          setError("Failed to fetch post");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching post:", error.message);
        setError("Error fetching post. Please try again later.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, currentUser]);

  const handleApply = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/posts/applicant-add/${id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setIsApplicant(true);
        alert("Application successful!");
      } else {
        alert("Failed to apply. Please try again.");
      }
    } catch (error) {
      console.error("Error applying to post:", error.message);
      alert("Failed to apply. Please try again.");
    }
  };

  const handleRemoveApplicant = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/posts/applicant-remove/${id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setIsApplicant(false);
        alert("Successfully removed your application.");
      } else {
        alert("Failed to remove application. Please try again.");
      }
    } catch (error) {
      console.error("Error removing application:", error.message);
      alert("Failed to remove application. Please try again.");
    }
  };

  const handleChooseApplicant = async (applicantId) => {
    console.log(`Chose applicant with ID: ${applicantId}`);
    // TODO : Implement choosing an applicant ON THE SERVER
  };

  console.log("Post:", post);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : post ? (
        <div>
          <h1>Post Details</h1>
          <Post post={post} />
          {isApplicant ? (
            <button
              onClick={handleRemoveApplicant}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Remove Application
            </button>
          ) : null}

          {currentUser && post.posterId === currentUser.uid && (
            <>
              <h2>Applicants:</h2>
              <ul>
                {post.applicants.map((applicant) => (
                  <li key={applicant}>
                    {/* {applicant.name} - {applicant.email} */}
                    {applicant}
                    <button onClick={() => handleChooseApplicant(applicant)}>
                      Choose Applicant
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {currentUser && post.posterId !== currentUser.uid && !isApplicant && (
            <button
              onClick={handleApply}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Apply to Post
            </button>
          )}
        </div>
      ) : (
        <p>Post not found</p>
      )}
    </div>
  );
};

export default PostPage;
