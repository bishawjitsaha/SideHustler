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

function AddExperienceModal({isOpen, user, handleClose}){
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
        await axios.post(`http://localhost:3000/user/${user.userName}`, updatedUser)
        window.location.reload();
    }

    return (
        <div>
            <ReactModal
                name = 'addModal'
                isOpen={showAddModal}
                style={customStyles}
                contentLabel="Add Experience">
                <h2>Add Experience</h2>
                <form 
                    id='addExperienceForm'
                    onSubmit={(e) => {
                        e.preventDefault();
                        try{
                            setShowAddModal(false);
                            alert('Experience Added');
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
                        <label htmlFor='company'>Company: </label>
                        <input 
                            type='text'
                            name='company'
                            placeholder='Enter Company Here'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='position'>Position: </label>
                        <input 
                            type='text'
                            name='position'
                            placeholder='Enter Position Here'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='startDate'>Start Date: </label>
                        <input 
                            type='text'
                            name='startDate'
                            placeholder='Enter Start Date Here'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='endDate'>End Date: </label>
                        <input 
                            type='text'
                            name='endDate'
                            placeholder='Enter End Date Here'
                            onChange={handleChange}
                        />
                    </div>
                    <button type='submit'>Add Experience</button>
                </form>
                <button onClick={handleCloseAddModal}>Close</button>
            </ReactModal>
        </div>
    )
}

export default AddExperienceModal;