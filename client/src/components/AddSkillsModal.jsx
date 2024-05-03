import React, {useState} from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { validateSkills } from '../validation/userValidation';

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

function AddSkillsModal({isOpen, user, handleClose}){
    const [showAddModal, setShowAddModal] = useState(isOpen);
    const [updatedUser, setUpdatedUser] = useState({...user});
    const [errorMessages, setErrorMessages] = useState('');
    const [isError, setIsError] = useState(false);
    
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
            await axios.post(`http://localhost:3000/user/${user.userName}`, skillsPayload);
            alert('Skill added successfully');
            handleClose();
            window.location.reload();
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
                <h2>Add Skill</h2>
                <form 
                    id='addSkillForm'
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label htmlFor='name'>Name: </label>
                        <input 
                            type='text'
                            name='name'
                            placeholder='Enter Skill Name Here'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>Description: </label>
                        <input 
                            type='text'
                            name='description'
                            placeholder='Enter Skill Description Here'
                            onChange={handleChange}
                        />
                    </div>
                    {isError && <p>{errorMessages}</p>}
                    <button type='submit'>Add Skill</button>
                </form>
                <button onClick={handleCloseAddModal}>Close</button>
            </ReactModal>
        </div>
    )
}

export default AddSkillsModal;