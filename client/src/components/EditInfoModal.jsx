import React, {useState} from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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

function EditInfoModal({isOpen, user, handleClose}) {
  const [showEditModal, setShowEditModal] = useState(isOpen);
  const [updatedUser, setUpdatedUser] = useState({...user});
  const [errorMessages, setErrorMessages] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    handleClose();
  };

  const handleChange = (e) => {
    setUpdatedUser({...updatedUser, [e.target.name]: e.target.value});
  }

  const handleErrors = (e) => {
    setErrorMessages(e);
  }

  const handleSubmit = async (e) => {
    await axios.post(`http://localhost:3000/user/${user.userName}`, updatedUser)
    navigate(`/user/${user.userName}`);
  }

  return (
    <div>
      <ReactModal
        name = 'editModal'
        isOpen={showEditModal}
        style={customStyles}
        contentLabel="Edit Info">

          <h2>Edit Info</h2>
          <form 
            id='editInfoForm'
            onSubmit={(e) => {
              e.preventDefault();
              try{
                setShowEditModal(false);
                alert('Info Updated');
                handleSubmit();
                handleClose();
              }
              catch(e){
                setIsError(true);
                handleErrors(e);
              }
            }}
            
            >
              <div>
                <label htmlFor="displayName">Username: </label>
                <input 
                  type="text" 
                  id='userName' 
                  name='userName' 
                  placeholder='Username'
                  value={updatedUser.displayName} 
                  onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="firstName">First Name: </label>
                <input 
                  type="text" 
                  id='firstName' 
                  name='firstName' 
                  placeholder='First Name'
                  value={updatedUser.firstName} 
                  onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="lastName">Last Name: </label>
                <input 
                  type="text" 
                  id='lastName' 
                  name='lastName' 
                  placeholder='Last Name'
                  value={updatedUser.lastName} 
                  onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="email">Email: </label>
                <input 
                  type="text" 
                  id='email' 
                  name='email' 
                  placeholder='Email'
                  value={updatedUser.email} 
                  onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="bio">Bio: </label>
                <input 
                  type="text" 
                  id='bio' 
                  name='bio' 
                  placeholder='Bio'
                  value={updatedUser.bio} 
                  onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="school">School: </label>
                <input 
                  type="text" 
                  id='school' 
                  name='school' 
                  placeholder='School'
                  onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="degree">Degree: </label>
                <input 
                  type="text" 
                  id='degree' 
                  name='degree' 
                  placeholder='Degree'
                  onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="major">Major: </label>
                <input 
                  type="text" 
                  id='major' 
                  name='major' 
                  placeholder='Major'
                  onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="gradYear">Graduation Year: </label>
                <input 
                  type="text" 
                  id='gradYear' 
                  name='gradYear' 
                  placeholder='Graduation Year'
                  onChange={handleChange} />
              </div>
              {/* <div>
                  <p>Experience</p>
                  <label htmlFor="company">Company: </label>
                  <select 
                      id='company' 
                      name='company'
                      onChange={handleChange}
                  >
                      {updatedUser.experience.map((exp, index) => (
                          <option key={index} value={exp.company}>{exp.company}</option>
                      ))}
                  </select>
              </div> */}
              <div>
                  <label htmlFor="company"> Company Name: </label>
                  <input 
                      type="text" 
                      id='company' 
                      name='company' 
                      placeholder='Company Name'
                      onChange={handleChange} 
                  />
              </div>
              <div>
                  <label htmlFor="position">Position: </label>
                  <input 
                      type="text" 
                      id='position' 
                      name='position' 
                      placeholder='Position'
                      onChange={handleChange} 
                  />
              </div>
              <div>
                  <label htmlFor="startDate">Start Date: </label>
                  <input 
                      type="text" 
                      id='startDate' 
                      name='startDate' 
                      placeholder='Start Date'
                      onChange={handleChange} 
                  />
              </div>
              <div>
                  <label htmlFor="endDate">End Date: </label>
                  <input 
                      type="text" 
                      id='endDate' 
                      name='endDate' 
                      placeholder='End Date'
                      onChange={handleChange} 
                  />
              </div>
              {/* <div>
                  <p>Skill</p>
                  <label htmlFor="skills">Skills: </label>
                  <select 
                      id='skills' 
                      name='skills'
                      onChange={handleChange}
                  >
                      {updatedUser.skills.map((skill, index) => (
                          <option key={index} value={skill.name}>{skill.name}</option>
                      ))}
                  </select>
              </div> */}
              <div>
                  <label htmlFor="skillName"> Skill Name: </label>
                  <input 
                      type="text" 
                      id='name' 
                      name='name' 
                      placeholder='Skill Name'
                      onChange={handleChange} 
                  />
              </div>
              <div>
                  <label htmlFor="skillDescription"> Skill Description: </label>
                  <input 
                      type="text" 
                      id='description' 
                      name='description' 
                      placeholder='Skill Description'
                      onChange={handleChange} 
                  />
              </div>
              
              <button type='submit'>Submit</button>
          </form>
          <button onClick={handleCloseEditModal}>Close</button>
      </ReactModal>
    </div>
  )
}

export default EditInfoModal