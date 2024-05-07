import {React, useState, useEffect, useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AddBioModal, AddEducationModal, AddExperienceModal, AddSkillsModal, EditInfoModal } from '../components'

function ProfilePage() {

    const [user, setUser] = useState(null)
    const { currentUser } = useContext(AuthContext);
    const { username } = useParams();
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showAddBioModal, setShowAddBioModal] = useState(false);
    const [showAddEducationModal, setShowAddEducationModal] = useState(false);
    const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
    const [showAddSkillsModal, setShowAddSkillsModal] = useState(false);
    const [bio, setBio] = useState('');
    const [education, setEducation] = useState({});
    const [experience, setExperience] = useState([]);
    const [skills, setSkills] = useState([]);

    const navigate = useNavigate();

    const fetchData = async () => {
        try{
            const res = await axios.get(`http://localhost:3000/user/${username}`);
            setUser(res.data);
            setBio(res.data.bio);
            setEducation(res.data.education);
            setExperience(res.data.experience);
            setSkills(res.data.skills);
        }
        catch (e) {
            console.error(e);
            navigate('/not-found');
        }
    }

    useEffect(() => {
        if(currentUser){
            fetchData();
        }
    }, [currentUser,username, bio, education, experience, skills])

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
        setShowAddBioModal(false);
        setShowAddEducationModal(false);
        setShowAddExperienceModal(false);
        setShowAddSkillsModal(false);
    };

    const addBio = (newBio) => {
        setBio(newBio);
    }

    const addEducation = (newEducation) => {
        setEducation(newEducation);
    }

    const addExperience = (newExperience) => {
        setExperience(newExperience);
    }

    const addSkills = (newSkill) => {
        setSkills(newSkill);
    }


    // console.log(user)
  return (
    <div className='flex justify-center'>
        {user && (
            <div>
                <h1 className='font-bold'>{user.firstName} {user.lastName}</h1>
                <p>Contact: {user.email}</p>
                {currentUser.displayName && currentUser.displayName === username && 
                            <button onClick={() => handleOpenInfoModal()}>Edit</button>}
                <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-white shadow-lg rounded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Bio</h2>
                        {user.bio && <p>{bio}</p>}
                        {(currentUser.displayName && currentUser.displayName === username) && !user.bio ? (
                            <button onClick={() => handleOpenBioModal()}>Add Bio</button>
                        ) : (
                            null
                        )}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Education</h2>
                        {education.school && <p>{education.school}</p>}
                        {education.degree && education.major && <p>{education.degree} in {education.major}</p>}
                        {education.gradYear && <p>Graduated in {education.gradYear}</p>}
                        {(currentUser.displayName && currentUser.displayName === username) && 
                            (!education.school || !education.degree || !education.gradYear || !education.major) ? (
                            <button onClick={() => handleOpenEducationModal()}>Add Education</button>
                        ) : (
                            null
                        )}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Experience</h2>
                        {experience.map((exp, index) => (
                            <div key={index} className='mb-2'>
                                {exp.company && <p>{exp.company}</p>}
                                {exp.position && <p>{exp.position}</p>}
                                {exp.startDate && exp.endDate && <p>{exp.startDate} to {exp.endDate}</p>}
                            </div>
                        ))}
                        {currentUser.displayName && currentUser.displayName === username && 
                            <button onClick={() => handleOpenExperienceModal()}>Add Experience</button>}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Skills</h2>
                        {skills.map((skill, index) => (
                            <div key={index} className='mb-2'>
                                {skill.name && <p className='text-left'>{skill.name}</p>}
                                {skill.description && <p className='text-left ml-5'>{skill.description}</p>}
                            </div>
                        ))}
                        {currentUser.displayName && currentUser.displayName === username && 
                            <button onClick={() => handleOpenSkillsModal()}>Add Skill</button>}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Rating</h2>
                        {user.rating.average && <p>Average: {user.rating.average}</p>}
                        {user.rating.total && <p>Total: {user.rating.total}</p>}
                    </div>
                    {(currentUser.displayName && currentUser.displayName === username) && 
                    <>
                    <div className='bg-white shadow-lg rounded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Applications</h2>
                        {user.applications.length > 0 ? user.applications.map((application, index) => (
                            <div key={index} className='mb-2'>
                                {application.post.title && <p>{application.post.title}</p>}
                                {application.status && <p>{application.status}</p>}
                                <button onClick={() => navigate(`/post/${application.post._id}`)}>View Post</button>
                            </div>
                        )) : <p>No Applications</p>}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Other Jobs Scheduled For</h2>
                        {user.reservedTime.length > 0 ? user.reservedTime.map((time, index) => (
                            <div key={index} className='mb-2'>
                                {time.dateStart && time.dateEnd && <p>{time.dateStart} to {time.dateEnd}</p>}
                                {time.timeStart && time.timeEnd && <p>{time.timeStart} to {time.timeEnd}</p>}
                            </div>
                        )) : <p>No Other Jobs Scheduled</p>}
                    </div>
                    </>
                    }
                    <div className='bg-white shadow-lg rounded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Posts</h2>
                        {user.posts.length > 0 ? user.posts.map((post, index) => (
                            <div key={index} className='mb-2'>
                                {post.title && 
                                <>
                                <p>{post.title}</p>
                                <p>{post.status}</p>
                                {post.applicants.length > 0 ?
                                    <p>Applicants: {post.applicants.length}</p> : <p>No Applicants</p>
                                }
                                <button onClick={() => navigate(`/post/${post._id}`)}>View Post</button>
                                </>
                                }
                            </div>
                        )) : <p>No Posts</p>}
                    </div>
                    
                </div>
                <div id='modal-container'>
                    {showAddBioModal && (
                    <AddBioModal 
                        isOpen={showAddBioModal} 
                        user = {user}
                        handleClose={handleCloseModals}
                        addBio={addBio} />
                    )}

                    {showAddEducationModal && (
                    <AddEducationModal 
                        isOpen={showAddEducationModal} 
                        user = {user}
                        handleClose={handleCloseModals}
                        addEducation={addEducation} />
                    )}

                    {showAddExperienceModal && (
                    <AddExperienceModal 
                        isOpen={showAddExperienceModal} 
                        user = {user}
                        handleClose={handleCloseModals}
                        addExperience={addExperience} />
                    )}

                    {showAddSkillsModal && (
                    <AddSkillsModal 
                        isOpen={showAddSkillsModal} 
                        user = {user}
                        handleClose={handleCloseModals} 
                        addSkills={addSkills}/>
                    )}

                    {showInfoModal && 
                    <EditInfoModal 
                        isOpen={showInfoModal}
                        user = {user}
                        handleClose={handleCloseModals}
                        addBio={addBio}
                        addEducation={addEducation}
                        addExperience={addExperience}
                        addSkills={addSkills}
                    />}
                </div>

            </div>
            )}
    </div>
  )
}

export default ProfilePage
