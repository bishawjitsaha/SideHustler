import {React, useState, useEffect, useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function ProfilePage() {

    const [user, setUser] = useState(null)
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);

    const fetchData = async () => {
        try{
            const res = await axios.get(`http://localhost:3000/user/${currentUser.displayName}`);
            setUser(res.data);
        }
        catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [currentUser])

    const navigateTo = () => {
        navigate(`/user/${currentUser.displayName}/manage`);
    }
    

  return (
    <div className='flex justify-center'>
        {user && (
            <div>
                <h1 className='font-bold'>{user.firstName} {user.lastName}</h1>
                <p>Contact: {user.email}</p>
                <button onClick={navigateTo}>Manage Profile</button>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Bio</h2>
                        {user.bio && <p>{user.bio}</p>}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Education</h2>
                        {user.education.school && <p>{user.education.school}</p>}
                        {user.education.degree && <p>{user.education.degree} in {user.education.major}</p>}
                        {user.education.gradYear && <p>Graduated in {user.education.gradYear}</p>}
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
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Skills</h2>
                        {user.skills.map((skill, index) => (
                            <div key={index} className='mb-2'>
                                {skill.name && <p className='text-left'>{skill.name}</p>}
                                {skill.description && <p className='text-left ml-5'>{skill.description}</p>}
                            </div>
                        ))}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Rating</h2>
                        {user.rating.average && <p>Average: {user.rating.average}</p>}
                        {user.rating.total && <p>Total: {user.rating.total}</p>}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Other Jobs Scheduled For</h2>
                        {user.unAvailable.map((time, index) => (
                            <div key={index} className='mb-2'>
                                {time.dateStart && time.dateEnd && <p>{time.dateStart} - {time.dateEnd}</p>}
                                {time.timeStart && time.timeEnd && <p>{time.timeStart} - {time.timeEnd}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}
    </div>
  )
}

export default ProfilePage
