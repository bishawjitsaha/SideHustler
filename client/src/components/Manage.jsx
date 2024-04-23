import { useContext, useState } from 'react'
import EditAccountModal from './EditAccountModal'
import { AuthContext } from '../context/AuthContext';


function Manage() {

    const [showEditModal, setShowEditModal] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const handleOpenEditModal = () => {
        setShowEditModal(true);
      };
    
    const handleCloseModals = () => {
        setShowEditModal(false);
    };

  return (
    <div>
        <h1>Manage</h1>
        <button onClick={() => handleOpenEditModal()}>Edit</button>
        {showEditModal && 
          <EditAccountModal 
          isOpen={showEditModal}
          user = {currentUser}
          handleClose={handleCloseModals} />}
    </div>

   

  )
}

export default Manage