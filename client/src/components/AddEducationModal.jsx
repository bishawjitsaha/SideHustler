import React, {useContext, useState} from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { validateEducation } from '../validation/userValidation';
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

function AddEducationModal({isOpen, user, handleClose, addEducation}){
    const [showAddModal, setShowAddModal] = useState(isOpen);
    const [updatedUser, setUpdatedUser] = useState({...user.education});
    const [errorMessages, setErrorMessages] = useState('');
    const [isError, setIsError] = useState(false);
    const { currentUser } = useContext(AuthContext); 

    const handleErrors = (e) => {
        setErrorMessages(e);
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
            const validatedEducation = validateEducation(updatedUser);
            const educationPayload = {
                school: validatedEducation.school,
                degree: validatedEducation.degree,
                major: validatedEducation.major,
                gradYear: validatedEducation.gradYear
            };
            const res = await axios.post(`https://localhost:3000/user/edit/${user.userName}`, educationPayload, {
                headers: {
                  Authorization: `Bearer ${currentUser.accessToken}`
                }
              });
            const addedEducation = res.data.education;
            alert('Education Added');
            handleClose();
            addEducation(addedEducation);
        }
        catch (e) {
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
                contentLabel="Add Education">
                <h2 className='text-center text-lg font-semibold'>Add Education</h2>
                <form 
                    id='addEducationForm'
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor='school'>School: </label>
                        <input 
                            type='text'
                            name='school'
                            placeholder='Enter School Here'
                            value={updatedUser.school || ''}
                            onChange={handleChange}
                            className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <div>
                        <label htmlFor='degree'>Degree: </label>
                        <input 
                            type='text'
                            name='degree'
                            placeholder='Enter Degree Here'
                            value={updatedUser.degree || ''}
                            onChange={handleChange}
                            className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <div>
                        <label htmlFor='major'>Major: </label>
                        <input 
                            type='text'
                            name='major'
                            placeholder='Enter Major Here'
                            value={updatedUser.major || ''}
                            onChange={handleChange}
                            className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <div>
                        <label htmlFor='gradYear'>Grad Year: </label>
                        <input 
                            type='text'
                            name='gradYear'
                            placeholder='Enter Grad Year Here'
                            value={updatedUser.gradYear || ''}
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
                                Add Education</button>
                    </div>
                </form>
            </ReactModal>
        </div>
    )
}

export default AddEducationModal;