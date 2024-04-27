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

function AddBioModal({isOpen, user, handleClose}){
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
                    id='addBioForm'
                    onSubmit={(e) => {
                        e.preventDefault();
                        try{
                            setShowAddModal(false);
                            alert('Bio Added');
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
                        <label htmlFor='bio'>Bio: </label>
                        <input 
                            type='text'
                            name='bio'
                            placeholder='Enter Bio Here'
                            value={updatedUser.bio || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <button type='submit'>Add Bio</button>
                </form>
                <button onClick={handleCloseAddModal}>Close</button>
            </ReactModal>
        </div>
    )
}

export default AddBioModal;