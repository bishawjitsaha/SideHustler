import React, {useState} from 'react';
import ReactModal from 'react-modal';

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

function EditAccountModal({isOpen, user, handleClose}) {
  const [showEditModal, setShowEditModal] = useState(isOpen);
  const [currentUser, setCurrentUser] = useState(user);
  const [errorMessages, setErrorMessages] = useState('');
  const [isError, setIsError] = useState(false);

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentUser(null);
    handleClose();
  };

  const handleErrors = (e) => {
    setErrorMessages(e);
  }

  return (
    <div>EditAccountModal</div>
  )
}

export default EditAccountModal