import React, { useState, useContext, useEffect } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import TagSelector from "./TagSelector";
import * as postValidation from '../validation/postValidation.js';
import { backendUrl } from '../App';

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
    const [selectedTags, setSelectedTags] = useState([]);
    const [tags, setTags] = useState([
        "Assembly",
        "Childcare",
        "Cleaning",
        "Delivery",
        "Design",
        "Handywork",
        "Indoors",
        "Installation",
        "IT Support",
        "Lawn Care",
        "Moving",
        "Outdoors",
        "Painting",
        "Petcare",
        "Photography",
        "Tutoring",
        "Wellness",
    ]);

    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        dateStart: '',
        dateEnd: '',
        timeStart: '',
        timeEnd: '',
        taskPayment: null,
        tags: null,
        workType: 'in-person',
    });
    const [errorMessages, setErrorMessages] = useState('');
    const [isError, setIsError] = useState(false);
    const [image, setImage] = useState(null);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };


    const handleUpload = async () => {
        if (image) {
            const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
            if (allowedTypes.includes(image.type.toLowerCase())) {
                const formData = new FormData();
                formData.append("file", image);
                try {
                    const response = await axios.post(`${backendUrl}/image/postImgUpload`, formData, {
                        headers: {
                            Authorization: `Bearer ${currentUser.accessToken}`
                        }
                    });
                    return response.data;
                } catch (err) {
                    console.log(err);
                    handleErrors("Error uploading image");
                }
            } else {
                handleErrors("Invalid file type");
                console.log("Invalid file type");
            }
        }
        // Return null if no image is selected
        return null;
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
            if (!currentUser) throw "No user logged in. Please log in to add a post."

            postValidation.validateTitle(newPost.title);
            postValidation.validateDescription(newPost.description);
            if (!newPost.dateStart || !newPost.dateEnd || !newPost.timeStart || !newPost.timeEnd) throw "Please select a start and end date and time."
            if (/^[0-9]{0,12}([.][0-9]{2,2})?$/.test(newPost.taskPayment) === false) throw "Invalid payment amount."

            const postURL = await handleUpload();

            let postObj = {
                title: newPost.title,
                description: newPost.description,
                taskTime: { dateStart: newPost.dateStart, dateEnd: newPost.dateEnd, timeStart: newPost.timeStart, timeEnd: newPost.timeEnd },
                taskPayment: parseFloat(newPost.taskPayment),
                workType: newPost.workType,
                photos: postURL ? postURL : "",
                posterId: currentUser.uid,
                tags: selectedTags,
            };

            console.log("postObj", postObj);

            const response = await axios.post('${backendUrl}/posts/create', postObj, {
                headers: {
                  Authorization: `Bearer ${currentUser.accessToken}`
                }
              });
            addPost(response.data.post)

            if (response.status === 200) {
                alert('Post Added Successfully');
                handleCloseAddModal();
            }

        } catch (error) {
            if (error.response) {
                // console.log(error.response.data.error);
                handleErrors(error.response.data.error);
            } else {
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
                <h2 className="text-xl font-bold mb-2">Add Post</h2>
                <form
                    id="addPostForm"
                    onSubmit={handleSubmit}
                    className="space-y-1"
                >
                    <div>
                        <label
                            htmlFor="title"
                            className="block font-medium text-gray-700"
                        >
                            Title:
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Enter Title"
                            value={newPost.title}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block font-medium text-gray-700"
                        >
                            Description:
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter Description"
                            value={newPost.description}
                            onChange={handleChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full resize-none focus:ring-blue-500 focus:border-blue-500"
                            rows="2"
                            resize="none"
                        />
                    </div>
                    <p className="block font-medium text-gray-700 mb-3">
                        Select Task Time:
                    </p>
                    <div className="flex items-center space-x-4 mb-4">
                        {/* Start Date */}
                        <div className="relative">
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
                                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        {/*  Start Time  */}
                        <div className="relative">
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
                                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        {/*  End Date  */}
                        <div className="relative">
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
                                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        {/*  End Time  */}
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
                                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div>
                            <label
                                htmlFor="taskPayment"
                                className="block text-m font-medium text-gray-700"
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
                        <div>


                            <label
                                htmlFor="workType"
                                className="block text-m font-medium text-gray-700"
                            >
                                Work Type:
                            </label>
                            <div>
                                <select
                                    id="workType"
                                    name="workType"
                                    onChange={handleChange}
                                    className="mt-1 inline-block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="in-person">In-person</option>
                                    <option value="remote">Remote</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <TagSelector
                        tags={tags}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                    />
                    <div className="add-image flex items-center justify-start mt-4">
                        <h2 className="text-m mr-4">Add Image:</h2>
                        <input className="cursor-pointer" type="file" onChange={handleFileChange} />
                    </div>
                    {isError && (
                        <p className="text-red-500 text-m mt-2 font-bold">
                            {errorMessages}
                        </p>
                    )}
                    <div className="flex justify-start items-center">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 mt-4 mr-2"
                        >
                            Add Post
                        </button>
                        <button
                            onClick={handleCloseAddModal}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-500 mt-4"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </ReactModal>
        </div>
    );
};

export default AddPost;
