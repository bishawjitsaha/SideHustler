import React, { useState, useContext } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

ReactModal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    border: '1px solid #28547a',
    borderRadius: '4px'
  }
};

const AddPost = ({ isOpen, handleClose, addPost }) => {
  const [showAddModal, setShowAddModal] = useState(isOpen);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    dateStart:'',
    dateEnd:'',
    timeStart:'',
    timeEnd:'',
    taskPayment: null,
    workType: 'remote'
  });
  const [errorMessages, setErrorMessages] = useState('');
  const [isError, setIsError] = useState(false);

  const handleErrors = (errorMessage) => {
    setErrorMessages(errorMessage);
    setIsError(true);
  };

  const handleClearErrors = () => {
    setErrorMessages('');
    setIsError(false);
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const { currentUser } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    handleClearErrors();
    try {
        if(!currentUser) throw "No user logged in. Please log in to add a post."
        if(/^[0-9]{0,12}([.][0-9]{2,2})?$/.test(newPost.taskPayment) === false) throw "Invalid payment amount."
        let postObj = {
            title: newPost.title,
            description: newPost.description,
            taskTime: { dateStart: newPost.dateStart, dateEnd: newPost.dateEnd, timeStart: newPost.timeStart, timeEnd: newPost.timeEnd},
            taskPayment: parseFloat(newPost.taskPayment),
            workType: newPost.workType,
            photos:[],
            posterId: currentUser.uid,
        };
      const response = await axios.post('http://localhost:3000/posts/create', postObj);

      addPost(response.data.post)
      if (response.status === 200) {
            alert('Post Added Successfully');
            handleCloseAddModal();
      }
    } catch (error) {
        if(error.response){
            // console.log(error.response.data.error);
            handleErrors(error.response.data.error);
        }else{
            // console.log(error);
            handleErrors(error);
        }
    }
  };

  return (
      <div>
          <ReactModal
              isOpen={showAddModal}
              style={customStyles}
              contentLabel="Add Post"
          >
              <h2>Add Post</h2>
              <form id="addPostForm" onSubmit={handleSubmit}>
                  <div>
                      <label htmlFor="title">Title: </label>
                      <input
                          type="text"
                          name="title"
                          placeholder="Enter Title"
                          value={newPost.title}
                          onChange={handleChange}
                      />
                  </div>
                  <div>
                      <label htmlFor="description">Description: </label>
                      <textarea
                          name="description"
                          placeholder="Enter Description"
                          value={newPost.description}
                          onChange={handleChange}
                      />
                  </div>
                  <br />
                  <p>Select Task Time: </p>
                  <div className="flex items-center">
                      {/* <!-- Start Date --> */}
                      <div className="relative mr-4">
                          <label
                              htmlFor="dateStart"
                              className="block text-sm font-medium text-gray-700"
                          >
                              Start Date:
                          </label>
                          <div className="relative mt-1">
                              <input
                                  id="dateStart"
                                  name="dateStart"
                                  type="date"
                                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                  min={new Date().toISOString().split("T")[0]}
                                  onChange={handleChange}
                              />
                          </div>
                      </div>
                      {/* <!-- Start Time --> */}
                      <div className="relative mr-4">
                          <label
                              htmlFor="timeStart"
                              className="block text-sm font-medium text-gray-700"
                          >
                              Start Time:
                          </label>
                          <div className="relative mt-1">
                              <input
                                  id="timeStart"
                                  name="timeStart"
                                  type="time"
                                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                  onChange={handleChange}
                              />
                          </div>
                      </div>
                  </div>
                  <br />
                  <div className="flex items-center justify-center">
                      <span className="text-gray-500">to</span>
                  </div>
                  <div className="flex items-center mt-4">
                      {/* <!-- End Date --> */}
                      <div className="relative mr-4">
                          <label
                              htmlFor="dateEnd"
                              className="block text-sm font-medium text-gray-700"
                          >
                              End Date:
                          </label>
                          <div className="relative mt-1">
                              <input
                                  id="dateEnd"
                                  name="dateEnd"
                                  type="date"
                                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                  min={new Date().toISOString().split("T")[0]}
                                  onChange={handleChange}
                              />
                          </div>
                      </div>
                      {/* <!-- End Time --> */}
                      <div className="relative">
                          <label
                              htmlFor="timeEnd"
                              className="block text-sm font-medium text-gray-700"
                          >
                              End Time:
                          </label>
                          <div className="relative mt-1">
                              <input
                                  id="timeEnd"
                                  name="timeEnd"
                                  type="time"
                                  className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                  onChange={handleChange}
                              />
                          </div>
                      </div>
                  </div>
                  {/* <div>
                      <label htmlFor="taskPayment">Task Payment: </label>
                      <input
                          type="text"
                          name="taskPayment"
                          placeholder="Enter Task Payment"
                          value={newPost.taskPayment}
                          onChange={handleChange}
                      />
                  </div> */}
                  <div>
                      <label
                          htmlFor="taskPayment"
                          className="block text-sm font-medium text-gray-700"
                      >
                          Task Payment:
                      </label>
                      <div className="mt-1 relative rounded-md">
                          <input
                              type="text"
                              id="taskPayment"
                              name="taskPayment"
                              className="appearance-none block w-32 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="0.00"
                              onChange={handleChange}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">$</span>
                          </div>
                      </div>
                  </div>
                  <label
                      htmlFor="workType"
                      className="block text-sm font-medium text-gray-700"
                  >
                      Work Type:
                  </label>
                  <div>
                      <select
                          id="workType"
                          name="workType"
                          className="mt-1 inline-block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                          <option value="in-person">In-person</option>
                          <option value="remote">Remote</option>
                      </select>
                  </div>
                  {isError && <p className="text-red-500 text-m mt-2 font-bold">{errorMessages}</p>}
                  <button type="submit">Add Post</button>
              </form>
              <button onClick={handleCloseAddModal}>Close</button>
          </ReactModal>
      </div>
  );
};

export default AddPost;
