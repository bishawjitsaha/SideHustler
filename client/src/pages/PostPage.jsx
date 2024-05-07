import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Post, RatingComponent } from "../components";
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
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
//   const [rating, setRating] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/posts/${id}`);

        if (response.status === 200) {
          const fetchedPost = response.data.post;
          setPost(fetchedPost);

          const currentUserIsApplicant =
            currentUser && fetchedPost && fetchedPost.applicants.some(applicant => applicant._id === currentUser?.uid);

          setIsApplicant(currentUserIsApplicant);
          setChosenApplicant(fetchedPost.selectedApplicant);
          setIsCompleted(fetchedPost.status === "completed");
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
    try{
      const res = await axios.put(`http://localhost:3000/posts/${post._id}`, { selectedApplicant: applicantId });
      setChosenApplicant(res.data.post.selectedApplicant);
      alert("Successfully selected applicant!");

    }
    catch (error) {
      console.error("Error choosing applicant:", error.message);
      alert("Failed to choose applicant. Please try again.");
    }
  };

  const handleUnchooseApplicant = async () => {
    try{
      const res = await axios.put(`http://localhost:3000/posts/${post._id}`, { selectedApplicant: null });
      setChosenApplicant(null);
      alert("Successfully removed applicant!");
    }
    catch (error) {
      console.error("Error unchoosing applicant:", error.message);
      alert("Failed to unchoose applicant. Please try again.");
    }
  }

  const handleCompleteTask = async () => {
    try{
      const res = await axios.put(`http://localhost:3000/posts/update-status/${post._id}`, { status: "completed" });
      setIsCompleted(true);
      setShowRatingModal(true);
      alert("Task successfully marked completed!");
    }
    catch (error) {
      console.error("Error completing task:", error.message);
      alert("Failed to complete task. Please try again.");
    }
  }

  const handleRateApplicant = async (rating) => {
    try {
        const res = await axios.post(
            `http://localhost:3000/user/update-rating/${chosenApplicant}`,
            { rating }
        );
        alert("Successfully rated applicant!");
        setShowRatingModal(false); // Close the rating modal after rating submission
    } catch (error) {
        console.error("Error rating applicant:", error.message);
        alert("Failed to rate applicant.");
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

          {currentUser && post.posterId === currentUser.uid && !isCompleted && ( //Show applicants and mark complete button if you are the poster and task is uncomplete
            <>
                {chosenApplicant && //Show Mark Complete button if an applicant has been chosen
                <button 
                    onClick={() => handleCompleteTask()}
                    className="mt-2 mb-4 bg-green-300"
                >
                    Mark Task Complete
                </button>
                }
            
              <h2>Applicants:</h2>
              <ul>
                {post.applicants.map((applicant) => (
                  <li key={applicant._id}>
                    <a href={`/user/${applicant.userName}`}>{applicant.firstName} {applicant.lastName}</a>
                    {chosenApplicant === applicant._id ? (
                      <button
                        onClick={() => handleUnchooseApplicant()}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
                      >
                        Remove
                      </button>
                        ) : (
                        !chosenApplicant && (
                          <button
                            onClick={() => handleChooseApplicant(applicant._id)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
                          >
                            Select
                          </button>
                        )
                      )}
                  </li>
                ))}
              </ul>
            </>
          )}
          {showRatingModal && (
            <RatingComponent
              isOpen={showRatingModal}
              onClose={() => setShowRatingModal(false)}
              onSubmit={handleRateApplicant}
            />
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
