import React, {useState} from 'react';
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

function AddEducationModal({isOpen, user, handleClose}){
    const [showAddModal, setShowAddModal] = useState(isOpen);
    const [updatedUser, setUpdatedUser] = useState({...user.education});
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
        await axios.post(`http://localhost:3000/user/${user.userName}`, updatedUser)
    }

    return (
        <div>
            <ReactModal
                name = 'addModal'
                isOpen={showAddModal}
                style={customStyles}
                contentLabel="Add Bio">
                <h2>Add Bio</h2>
                <form 
                    id='addEducationForm'
                    onSubmit={(e) => {
                        e.preventDefault();
                        try{
                            setShowAddModal(false);
                            alert('Education Added');
                            handleSubmit();
                            handleClose();
                        }
                        catch (e) {
                            handleErrors(e);
                            setIsError(true);
                        }
                    }}
                >
                    <div>
                        <label htmlFor='school'>School: </label>
                        <input 
                            type='text'
                            name='school'
                            placeholder='Enter School Here'
                            value={updatedUser.school || ''}
                            onChange={handleChange}
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
                        />
                    </div>
                    <button type='submit'>Add Education</button>
                </form>
                <button onClick={handleCloseAddModal}>Close</button>
            </ReactModal>
        </div>
    )
}

export default AddEducationModal;