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
  const [chosenApplicant, setChosenApplicant] = useState(null);
  const [curStatus, setCurStatus] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/posts/${id}`);

        if (response.status === 200) {
          const fetchedPost = response.data.post;
          setPost(fetchedPost);
          setChosenApplicant(fetchedPost.selectedApplicant);

          const currentUserIsApplicant =
            currentUser && fetchedPost && fetchedPost.applicants.some(applicant => applicant._id === currentUser?.uid);

          setIsApplicant(currentUserIsApplicant);
          setChosenApplicant(fetchedPost.selectedApplicant);
          setLoading(false);
          setCurStatus(fetchedPost.status);
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
        setCurStatus("Open");
        alert("Successfully removed your application.");

        const updateResponse = await axios.put( //in case user is the selected applicant, remove selected applicant
          `http://localhost:3000/posts/${id}`,
          {
            selectedApplicant: null,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.accessToken}`,
            },
          }
        );
        if (updateResponse.status !== 200) {
          throw new Error("Failed to update post");
        }
      } else {
        alert("Failed to remove application. Please try again.");
      }
    } catch (error) {
      console.error("Error removing application:", error.message);
      alert("Failed to remove application. Please try again.");
    }
  };

  const handleChooseApplicant = async (applicantId) => {
    try {
      const res = await axios.put(`http://localhost:3000/posts/${post._id}`, { selectedApplicant: applicantId });
      setChosenApplicant(res.data.post.selectedApplicant);
      alert("Successfully chose applicant!");
      setCurStatus("In Progress");

    }
    catch (error) {
      console.error("Error choosing applicant:", error.message);
      alert("Failed to choose applicant. Please try again.");
    }
  };

  const handleUnchooseApplicant = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/posts/${post._id}`, { selectedApplicant: null });
      setChosenApplicant(null);
      alert("Successfully unchose applicant!");
      setCurStatus("Open");
    }
    catch (error) {
      console.error("Error unchoosing applicant:", error.message);
      alert("Failed to unchoose applicant. Please try again.");
    }
  }

  console.log(post?.applicants)

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : post ? (
        <div className="mx-auto">
          <br />
          <Post post={post} status={curStatus} />
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
              {post.applicants && post.applicants.length === 0 && <p>No applicants yet.</p>}
              <ul>
                {post.applicants.map((applicant) => (
                  <li key={applicant._id}>
                    <a href={`/user/${applicant.userName}`}>{applicant.firstName} {applicant.lastName}</a>
                    {chosenApplicant === applicant._id ? (
                      <button
                        onClick={() => handleUnchooseApplicant()}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
                      >
                        Unchoose
                      </button>
                    ) : (
                      !chosenApplicant && (
                        <button
                          onClick={() => handleChooseApplicant(applicant._id)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
                        >
                          Choose
                        </button>
                      )
                    )}
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
