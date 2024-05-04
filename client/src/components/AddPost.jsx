import React, { useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';

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

const AddPost = ({ isOpen, handleClose }) => {
  const [showAddModal, setShowAddModal] = useState(isOpen);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    taskTime: '',
    taskPayment: '',
    workType: 'remote'
  });
  const [errorMessages, setErrorMessages] = useState('');
  const [isError, setIsError] = useState(false);

  const handleErrors = (errorMessage) => {
    setErrorMessages(errorMessage);
    setIsError(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/posts', newPost);
      if (response.status === 201) {
        alert('Post Added Successfully');
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      handleErrors(error.response.data.message);
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
        <form id='addPostForm' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='title'>Title: </label>
            <input
              type='text'
              name='title'
              placeholder='Enter Title'
              value={newPost.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='description'>Description: </label>
            <textarea
              name='description'
              placeholder='Enter Description'
              value={newPost.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='taskTime'>Task Time: </label>
            <input
              type='text'
              name='taskTime'
              placeholder='Enter Task Time'
              value={newPost.taskTime}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='taskPayment'>Task Payment: </label>
            <input
              type='text'
              name='taskPayment'
              placeholder='Enter Task Payment'
              value={newPost.taskPayment}
              onChange={handleChange}
            />
          </div>
          {isError && <p>{errorMessages}</p>}
          <button type='submit'>Add Post</button>
        </form>
        <button onClick={handleCloseAddModal}>Close</button>
      </ReactModal>
    </div>
  );
};

export default AddPost;
