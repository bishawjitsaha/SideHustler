import React, {useState} from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import * as validate from '../validation/userValidation.js';

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
  const [companySelected, setCompanySelected] = useState('');
  const [skillSelected, setSkillSelected] = useState('');

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    handleClose();
  };

  const handleChange = (e) => {
    setUpdatedUser({...updatedUser, [e.target.name]: e.target.value});
  }

  const handleCompanyChange = (e) => {
    setCompanySelected(e.target.value);
  }

  const handleSkillChange = (e) => {
    setSkillSelected(e.target.value);
  }

  const handleErrors = (e) => {
    setErrorMessages(e);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{

      if(updatedUser.userName) {
        validate.validateUsername(updatedUser.userName);
      }
      if(updatedUser.firstName) {
        validate.validateName(updatedUser.firstName);
      }
      if(updatedUser.lastName) {
        validate.validateName(updatedUser.lastName);
      }
      if(updatedUser.bio) {
        validate.validateBio(updatedUser.bio);
      }
      if(updatedUser.school || 
        updatedUser.degree || 
        updatedUser.major || 
        updatedUser.gradYear) {
        validate.validateEducation({
          school: updatedUser.school || user.education.school,
          degree: updatedUser.degree || user.education.degree,
          major: updatedUser.major || user.education.major,
          gradYear: updatedUser.gradYear || user.education.gradYear
        });
      }

      if((updatedUser.experience && updatedUser.experience.length > 0) && 
      (updatedUser.company || updatedUser.position || updatedUser.startDate || updatedUser.endDate)) {
        if(!companySelected || companySelected === 'none') {
          throw 'Please select a company to edit';
        }

        updatedUser.experience.map((exp) => {
          if(companySelected === exp.company) {
            validate.validateExperience([{
              company: updatedUser.company || exp.company,
              position: updatedUser.position || exp.position,
              startDate: updatedUser.startDate || exp.startDate,
              endDate: updatedUser.endDate || exp.endDate
            }]);
          }
        });
      }

      if((updatedUser.skills && updatedUser.skills.length > 0) && 
      (updatedUser.name || updatedUser.description)) {
        if(!skillSelected || skillSelected === 'none') {
          throw 'Please select a skill to edit';
        }
        updatedUser.skills.map((skill) => {
          if(skillSelected === skill.name) {
            validate.validateSkills([{
              name: updatedUser.name || skill.name,
              description: updatedUser.description || skill.description
            }]);
          }
        });
      }

      const dataToSend = {
        ...updatedUser,
        companyList: companySelected,
        skillsList: skillSelected,
      }

      await axios.post(`http://localhost:3000/user/${user.userName}`, dataToSend)
      alert('Info Updated');
      handleClose();
      window.location.reload();
    }
    catch(e){
      setIsError(true);
      handleErrors(e);
    }
  }

  return (
    <div>
      <ReactModal
        name = 'editModal'
        isOpen={showEditModal}
        style={customStyles}
        contentLabel="Edit Info"
        >

          <h2 className='text-center text-lg font-semibold'>Edit Info</h2>
          <form 
            id='editInfoForm'
            onSubmit={handleSubmit}
            >
            <div className='flex'>
              <div className='mr-4'>
                <label htmlFor="username">Username: </label>
                <input 
                  type="text" 
                  id='userName' 
                  name='userName' 
                  placeholder='Username'
                  value={updatedUser.userName} 
                  onChange={handleChange}
                  className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' />
              </div>
              <div className='mr-4'>
                <label htmlFor="firstName">First Name: </label>
                <input 
                  type="text" 
                  id='firstName' 
                  name='firstName' 
                  placeholder='First Name'
                  value={updatedUser.firstName} 
                  onChange={handleChange}
                  className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' />
              </div>
              <div className='mr-4'>
                <label htmlFor="lastName">Last Name: </label>
                <input 
                  type="text" 
                  id='lastName' 
                  name='lastName' 
                  placeholder='Last Name'
                  value={updatedUser.lastName} 
                  onChange={handleChange}
                  className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' />
              </div>
            </div>
              <div>
                <label htmlFor="bio">Bio: </label>
                <input 
                  type="text" 
                  id='bio' 
                  name='bio' 
                  placeholder='Bio'
                  value={updatedUser.bio} 
                  onChange={handleChange} 
                  className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'/>
              </div>
            <div className='flex'>
              <div className='mr-4'>
                <label htmlFor="school">School: </label>
                <input 
                  type="text" 
                  id='school' 
                  name='school' 
                  placeholder='School'
                  onChange={handleChange}
                  className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' />
              </div>
              <div className='mr-4'>
                <label htmlFor="degree">Degree: </label>
                <input 
                  type="text" 
                  id='degree' 
                  name='degree' 
                  placeholder='Degree'
                  onChange={handleChange} 
                  className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'/>
              </div>
              <div className='mr-4'>
                <label htmlFor="major">Major: </label>
                <input 
                  type="text" 
                  id='major' 
                  name='major' 
                  placeholder='Major'
                  onChange={handleChange}
                  className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' />
              </div>
              <div className='mr-4'>
                <label htmlFor="gradYear">Graduation Year: </label>
                <input 
                  type="text" 
                  id='gradYear' 
                  name='gradYear' 
                  placeholder='Graduation Year'
                  onChange={handleChange}
                  className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' />
              </div>
            </div>
              <div>
                  <label htmlFor="companyList">Company: </label>
                  <select 
                      id='companyList' 
                      name='companyList'
                      value={companySelected}
                      onChange={handleCompanyChange}
                      className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  >
                      <option value="none">Select A Company To Edit</option>
                      {updatedUser.experience.map((exp, index) => (
                          <option key={index} value={exp.company}>{exp.company}</option>
                      ))}
                  </select>
              </div>
            <div className='flex'>
              <div className='mr-4'>
                  <label htmlFor="company"> Company Name: </label>
                  <input 
                      type="text" 
                      id='company' 
                      name='company' 
                      placeholder='Company Name'
                      onChange={handleChange}
                      className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50' 
                  />
              </div>
              <div className='mr-4'>
                  <label htmlFor="position">Position: </label>
                  <input 
                      type="text" 
                      id='position' 
                      name='position' 
                      placeholder='Position'
                      onChange={handleChange} 
                      className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  />
              </div>
              <div className='mr-4'>
                  <label htmlFor="startDate">Start Date: </label>
                  <input 
                      type="text" 
                      id='startDate' 
                      name='startDate' 
                      placeholder='Start Date'
                      onChange={handleChange} 
                      className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  />
              </div>
              <div className='mr-4'>
                  <label htmlFor="endDate">End Date: </label>
                  <input 
                      type="text" 
                      id='endDate' 
                      name='endDate' 
                      placeholder='End Date'
                      onChange={handleChange} 
                      className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  />
              </div>
            </div>
              <div>
                  <label htmlFor="skillsList">Skills: </label>
                  <select 
                      id='skillsList' 
                      name='skillsList'
                      value={skillSelected}
                      onChange={handleSkillChange}
                      className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  >
                      <option value="none">Select A Skill To Edit</option>
                      {updatedUser.skills.map((skill, index) => (
                          <option key={index} value={skill.name}>{skill.name}</option>
                      ))}
                  </select>
              </div>
            <div className='flex'>
              <div className='mr-4'>
                  <label htmlFor="skillName"> Skill Name: </label>
                  <input 
                      type="text" 
                      id='name' 
                      name='name' 
                      placeholder='Skill Name'
                      onChange={handleChange} 
                      className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  />
              </div>
              <div className='mr-4'>
                  <label htmlFor="skillDescription"> Skill Description: </label>
                  <input 
                      type="text" 
                      id='description' 
                      name='description' 
                      placeholder='Skill Description'
                      onChange={handleChange} 
                      className='py-1 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 '
                  />
              </div>
            </div>
              {isError && <p className='text-red-600 flex justify-center'>{errorMessages}</p>}
            <div className='flex justify-end items-end flex-grow'>
              <button 
                onClick={handleCloseEditModal}
                className='my-4'>
                  Close</button>
              <button 
                type='submit'
                className='my-4 ml-auto'>
                  Submit</button>
            </div>
          </form>
      </ReactModal>
    </div>
  )
}

export default EditInfoModal