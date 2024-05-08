import React, { useContext, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { validateBio } from '../validation/userValidation';
import { AuthContext } from '../context/AuthContext';

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

function AddBioModal({ isOpen, user, handleClose, addBio }) {
    const [showAddModal, setShowAddModal] = useState(isOpen);
    const [updatedUser, setUpdatedUser] = useState({ ...user });
    const [errorMessages, setErrorMessages] = useState('');
    const [isError, setIsError] = useState(false);
    const { currentUser } = useContext(AuthContext)

    const handleErrors = (e) => {
        setErrorMessages(e);
    }
    const handleCloseAddModal = () => {
        setShowAddModal(false);
        handleClose();
    };

    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        if (!currentUser) return;

        e.preventDefault();
        try {
            const validatedBio = validateBio(updatedUser.bio);
            const res = await axios.post(`https://localhost:3000/user/${user.userName}`, { bio: validatedBio }, {
                headers: {
                    Authorization: `Bearer ${currentUser.accessToken}`
                }
            });
            const addedBio = res.data.bio;
            alert('Bio Added');
            handleClose();
            addBio(addedBio);
        }
        catch (e) {
            handleErrors(e);
            setIsError(true);
        }
    }

    useEffect(() => {
        setShowAddModal(isOpen);
    }, [currentUser, isOpen, user]);

    return (
        <div>
            <ReactModal
                name='addModal'
                isOpen={showAddModal}
                style={customStyles}
                contentLabel="Add Bio">
                <h2 className='text-center text-lg font-semibold'>Add Bio</h2>
                <form
                    id='addBioForm'
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor='bio'>Bio: </label>
                        <input
                            type='text'
                            name='bio'
                            placeholder='Enter Bio Here'
                            value={updatedUser.bio || ''}
                            onChange={handleChange}
                            className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>

                    {isError && <div className='text-red-600 flex justify-center'>{errorMessages}</div>}

                    <div className='flex justify-end items-end flex-grow'>
                        <button
                            onClick={handleCloseAddModal}
                            className='my-4 '>
                            Close</button>
                        <button
                            type='submit'
                            className='my-4 ml-auto'>
                            Add Bio</button>
                    </div>
                </form>
            </ReactModal>
        </div>
    )
}

export default AddBioModal;