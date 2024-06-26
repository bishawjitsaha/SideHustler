import React, {useContext, useState} from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { validateExperience } from '../validation/userValidation';
import { AuthContext } from '../context/AuthContext';
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

function AddExperienceModal({isOpen, user, handleClose, addExperience}){
    const [showAddModal, setShowAddModal] = useState(isOpen);
    const [updatedUser, setUpdatedUser] = useState({...user});
    const [errorMessages, setErrorMessages] = useState('');
    const [isError, setIsError] = useState(false);
    const { currentUser } = useContext(AuthContext)
    
    const handleErrors = (e) => {
        if (typeof e === 'string') {
            // Frontend error
            setErrorMessages(e);
        } else if (e.response && e.response.data && e.response.data.message) {
            // Backend error
            setErrorMessages(e.response.data.message);
        } else {
            // Fallback for any other type of error
            setErrorMessages('An error occurred.');
        }
    }
    const handleCloseAddModal = () => {
        setShowAddModal(false);
        handleClose();
      };

    const handleChange = (e) => {
        setUpdatedUser({...updatedUser, [e.target.name]: e.target.value});
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const validatedExperience = validateExperience([{
                company: updatedUser.company,
                position: updatedUser.position,
                startDate: updatedUser.startDate,
                endDate: updatedUser.endDate
            
            }]);
            const experiencePayload = {
                company: validatedExperience[0].company,
                position: validatedExperience[0].position,
                startDate: validatedExperience[0].startDate,
                endDate: validatedExperience[0].endDate
            };
            
            const res =  await axios.post(`${backendUrl}/user/edit/${user.userName}`, experiencePayload, {
                headers: {
                  Authorization: `Bearer ${currentUser.accessToken}`
                }
              });
            const addedExperience = res.data.experience;
            alert('Experience added successfully');
            handleClose();
            addExperience(addedExperience);
        } catch (e) {
            handleErrors(e);
            setIsError(true);
        }
    }

    return (
        <div>
            <ReactModal
                name = 'addModal'
                isOpen={showAddModal}
                style={customStyles}
                contentLabel="Add Experience">
                <h2 className='text-center text-lg font-semibold'>Add Experience</h2>
                <form 
                    id='addExperienceForm'
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor='company'>Company: </label>
                        <input 
                            id='company'
                            type='text'
                            name='company'
                            placeholder='Enter Company Here'
                            onChange={handleChange}
                            className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <div>
                        <label htmlFor='position'>Position: </label>
                        <input 
                            id='position'
                            type='text'
                            name='position'
                            placeholder='Enter Position Here'
                            onChange={handleChange}
                            className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <div>
                        <label htmlFor='startDate'>Start Date: </label>
                        <input 
                            id='startDate'
                            type='date'
                            name='startDate'
                            onChange={handleChange}
                            className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>End Date: </label>
                        <input 
                            id='endDate'
                            type='date'
                            name='endDate'
                            onChange={handleChange}
                            className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    {isError && <div className='text-red-600 flex justify-center'>{errorMessages}</div>}
                <div className='flex justify-end items-end flex-grow'>
                    <button 
                        onClick={handleCloseAddModal}
                        className='my-4'>
                            Close</button>
                    <button 
                        type='submit'
                        className='my-4 ml-auto'>
                            Add Experience</button>
                </div>
                </form>
            </ReactModal>
        </div>
    )
}

export default AddExperienceModal;
