import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Post, RatingComponent } from "../components";
import { useParams, useNavigate } from "react-router-dom";
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
  const [curStatus, setCurStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!currentUser) {
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });

        if (response.status === 200) {
          const fetchedPost = response.data.post;
          setPost(fetchedPost);
          setChosenApplicant(fetchedPost.selectedApplicant);

          const currentUserIsApplicant =
            currentUser &&
            fetchedPost &&
            fetchedPost.applicants.some(
              (applicant) => applicant._id === currentUser?.uid
            );

          setIsApplicant(currentUserIsApplicant);
          setChosenApplicant(fetchedPost.selectedApplicant);
          setIsCompleted(fetchedPost.status === "completed");
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
        alert("Successfully removed your application.");

        const updateResponse = await axios.put(
          //in case user is the selected applicant, remove selected applicant
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
      const res = await axios.put(
        `http://localhost:3000/posts/${post._id}`,
        { selectedApplicant: applicantId },
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      setChosenApplicant(res.data.post.selectedApplicant);
      alert("Successfully selected applicant!");
      setCurStatus("In Progress");
    } catch (error) {
      console.error("Error choosing applicant:", error.message);
      alert("Failed to choose applicant. Please try again.");
    }
  };

  const handleUnchooseApplicant = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/posts/${post._id}`,
        { selectedApplicant: null },
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      setChosenApplicant(null);
      alert("Successfully removed applicant!");
      setCurStatus("Open");
    } catch (error) {
      console.error("Error unchoosing applicant:", error.message);
      alert("Failed to unchoose applicant. Please try again.");
    }
  };

  const handleCompleteTask = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/posts/update-status/${post._id}`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      setIsCompleted(true);
      setShowRatingModal(true);
      setCurStatus("completed");
      alert("Task successfully marked completed!");
    } catch (error) {
      console.error("Error completing task:", error.message);
      alert("Failed to complete task. Please try again.");
    }
  };

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
  };

  const GoToChat = async () => {
    try {
      const user = await axios.get(
        `http://localhost:3000/user/getById/${currentUser.uid}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );

      const poster = await axios.get(
        `http://localhost:3000/user/getById/${post.posterId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );

      const chatId = user.data.chatLog.find(
        (entry) => entry.to === poster.data.userName
      )?.chatID;

      if (!chatId) {
        throw new Error("Chat not found");
      }

      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.error("Error starting chat:", error.message);
      alert("Failed to start chat. Please try again.");
    }
  };

  //   console.log(post?.applicants)

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
            <>
              {chosenApplicant ? (
                // Case: Current user is the chosen applicant
                chosenApplicant === currentUser.uid ? (
                  <>
                    <p className="text-green-500 text-lg font-bold">
                      Congratulations! You have been chosen for this post.
                    </p>
                    <button
                      onClick={GoToChat}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                      Chat with the Poster
                    </button>
                  </>
                ) : (
                  // Case: Someone else is chosen
                  <p className="text-red-500 text-lg font-bold">
                    Sorry, someone else has been selected for this job.
                  </p>
                )
              ) : (
                // Case: No chosen applicant yet, show remove application button
                <button
                  onClick={handleRemoveApplicant}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Remove Application
                </button>
              )}
            </>
          ) : null}

          {currentUser &&
            post.posterId === currentUser.uid &&
            !isCompleted && ( // Show applicants and mark complete button if you are the poster and task is uncomplete
              <>
                {chosenApplicant && ( // Show Mark Complete button if an applicant has been chosen
                  <button
                    onClick={() => handleCompleteTask()}
                    className="mt-2 mb-4 bg-green-300"
                  >
                    Mark Task Complete
                  </button>
                )}

                {chosenApplicant ? null : ( // Show applicants only if no applicant is chosen
                  <>
                    <h2>Applicants:</h2>
                    {post.applicants && post.applicants.length === 0 ? (
                      <p>No applicants yet.</p>
                    ) : (
                      <ul>
                        {post.applicants.map((applicant) => (
                          <li key={applicant._id}>
                            <Link to={`/user/${applicant.userName}`}>
                              {applicant.firstName} {applicant.lastName}
                            </Link>
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
                                  onClick={() =>
                                    handleChooseApplicant(applicant._id)
                                  }
                                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
                                >
                                  Select
                                </button>
                              )
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
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
