import {React, useState, useEffect, useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import EditInfoModal from '../components/EditInfoModal'
import AddBioModal from '../components/AddBioModal'
import AddEducationModal from '../components/AddEducationModal'
import AddExperienceModal from '../components/AddExperienceModal'
import AddSkillsModal from '../components/AddSkillsModal'

function ProfilePage() {

    const [user, setUser] = useState(null)
    const { currentUser } = useContext(AuthContext);
    const { username } = useParams();
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showAddBioModal, setShowAddBioModal] = useState(false);
    const [showAddEducationModal, setShowAddEducationModal] = useState(false);
    const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
    const [showAddSkillsModal, setShowAddSkillsModal] = useState(false);

    const fetchData = async () => {
        try{
            const res = await axios.get(`http://localhost:3000/user/${username}`);
            setUser(res.data);
        }
        catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if(currentUser){
            fetchData();
        }
    }, [currentUser])

    const handleOpenInfoModal = () => {
        setShowInfoModal(true);
      };

    const handleOpenBioModal = () => {
        setShowAddBioModal(true);
    };

    const handleOpenEducationModal = () => {
        setShowAddEducationModal(true);
    };

    const handleOpenExperienceModal = () => {
        setShowAddExperienceModal(true);
    };

    const handleOpenSkillsModal = () => {
        setShowAddSkillsModal(true);
    };

    const handleCloseModals = () => {
        setShowInfoModal(false);
        setShowAddEducationModal(false);
        setShowAddExperienceModal(false);
        setShowAddSkillsModal(false);
    };

  return (
    <div className='flex justify-center'>
        {user && (
            <div>
                <h1 className='font-bold'>{user.firstName} {user.lastName}</h1>
                <p>Contact: {user.email}</p>
                {currentUser.displayName && currentUser.displayName === username && 
                            <button onClick={() => handleOpenInfoModal()}>Edit</button>}
                <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Bio</h2>
                        {user.bio && <p>{user.bio}</p>}
                        {(currentUser.displayName && currentUser.displayName === username) && !user.bio ? (
                            <button onClick={() => handleOpenBioModal()}>Add Bio</button>
                        ) : (
                            null
                        )}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Education</h2>
                        {user.education.school && <p>{user.education.school}</p>}
                        {user.education.degree && user.education.major && <p>{user.education.degree} in {user.education.major}</p>}
                        {user.education.gradYear && <p>Graduated in {user.education.gradYear}</p>}
                        {(currentUser.displayName && currentUser.displayName === username) && 
                            (!user.education.school || !user.education.degree || !user.education.gradYear || !user.education.major) ? (
                            <button onClick={() => handleOpenEducationModal()}>Add Education</button>
                        ) : (
                            null
                        )}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Experience</h2>
                        {user.experience.map((exp, index) => (
                            <div key={index} className='mb-2'>
                                {exp.company && <p>{exp.company}</p>}
                                {exp.position && <p>{exp.position}</p>}
                                {exp.startDate && exp.endDate && <p>{exp.startDate} - {exp.endDate}</p>}
                            </div>
                        ))}
                        {currentUser.displayName && currentUser.displayName === username && 
                            <button onClick={() => handleOpenInfoModal()}>Add Experience</button>}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Skills</h2>
                        {user.skills.map((skill, index) => (
                            <div key={index} className='mb-2'>
                                {skill.name && <p className='text-left'>{skill.name}</p>}
                                {skill.description && <p className='text-left ml-5'>{skill.description}</p>}
                            </div>
                        ))}
                        {currentUser.displayName && currentUser.displayName === username && 
                            <button onClick={() => handleOpenInfoModal()}>Add Skill</button>}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Rating</h2>
                        {user.rating.average && <p>Average: {user.rating.average}</p>}
                        {user.rating.total && <p>Total: {user.rating.total}</p>}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Other Jobs Scheduled For</h2>
                        {user.reservedTime.map((time, index) => (
                            <div key={index} className='mb-2'>
                                {time.dateStart && time.dateEnd && <p>{time.dateStart} - {time.dateEnd}</p>}
                                {time.timeStart && time.timeEnd && <p>{time.timeStart} - {time.timeEnd}</p>}
                            </div>
                        ))}
                    </div>
                    {/* <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Posts</h2>
                        {user.posts.map((post, index) => (
                            <div key={index} className='mb-2'>
                                {post}
                            </div>
                        ))}
                    </div> */}
                </div>
                <div id='modal-container'>
                {showAddBioModal && (
                <AddBioModal 
                    isOpen={showAddBioModal} 
                    user = {user}
                    handleClose={handleCloseModals} />
                )}

                {showAddEducationModal && (
                <AddEducationModal 
                    isOpen={showAddEducationModal} 
                    user = {user}
                    handleClose={handleCloseModals} />
                )}

                {showAddExperienceModal && (
                <AddExperienceModal 
                    isOpen={showAddExperienceModal} 
                    user = {user}
                    handleClose={handleCloseModals} />
                )}

                {showAddSkillsModal && (
                <AddSkillsModal 
                    isOpen={showAddSkillsModal} 
                    user = {user}
                    handleClose={handleCloseModals} />
                )}

                {showInfoModal && 
                <EditInfoModal 
                    isOpen={showInfoModal}
                    user = {user}
                    handleClose={handleCloseModals}
                />}
                </div>

            </div>
            )}
    </div>
  )
}

export default ProfilePage
