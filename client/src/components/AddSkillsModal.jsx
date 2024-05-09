import React, {useContext, useState} from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { validateSkills } from '../validation/userValidation';
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

function AddSkillsModal({isOpen, user, handleClose, addSkills}){
    const [showAddModal, setShowAddModal] = useState(isOpen);
    const [updatedUser, setUpdatedUser] = useState({...user});
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
            const validatedSkills = validateSkills([{
                name: updatedUser.name,
                description: updatedUser.description
            }]);
            const skillsPayload = {
                name: validatedSkills[0].name,
                description: validatedSkills[0].description
            };
            const res = await axios.post(`${backendUrl}/user/edit/${user.userName}`, skillsPayload, {
                headers: {
                  Authorization: `Bearer ${currentUser.accessToken}`
                }
              });
            const addedSkills = res.data.skills;
            alert('Skill added successfully');
            handleClose();
            addSkills(addedSkills);
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
                contentLabel="Add Skill">
                <h2 className='text-center text-lg font-semibold'>Add Skill</h2>
                <form 
                    id='addSkillForm'
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor='name'>Name: </label>
                        <input 
                            id='name'
                            type='text'
                            name='name'
                            placeholder='Enter Skill Name Here'
                            onChange={handleChange}
                            className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>Description: </label>
                        <input 
                            id='description'
                            type='text'
                            name='description'
                            placeholder='Enter Skill Description Here'
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
                                Add Skill</button>
                    </div>
                </form>
            </ReactModal>
        </div>
    )
}

export default AddSkillsModal;