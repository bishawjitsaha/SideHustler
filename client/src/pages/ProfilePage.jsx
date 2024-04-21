import {React, useState, useEffect} from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

function ProfilePage() {

    const [user, setUser] = useState(null)

    const fetchData = async () => {
        try{
            const res = await axios.get(`http://localhost:3000/profile`);
            setUser(res.data);
        }
        catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    

  return (
    <div className='flex justify-center'>
        {user && (
            <div>
                <h1 className='font-bold'>{user.firstName} {user.lastName}</h1>
                <p>Contact: {user.email}</p>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Bio</h2>
                        <p>{user.bio}</p>
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Education</h2>
                        <p>{user.education.school}</p>
                        <p>{user.education.degree} in {user.education.major}</p>
                        <p>Graduated in {user.education.gradYear}</p>
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Experience</h2>
                        {user.experience.map((exp, index) => (
                            <div key={index} className='mb-2'>
                                <p>{exp.company}</p>
                                <p>{exp.position}</p>
                                <p>{exp.startDate} - {exp.endDate}</p>
                            </div>
                        ))}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Skills</h2>
                        {user.skills.map((skill, index) => (
                            <div key={index} className='mb-2'>
                                <p className='text-left'>{skill.name}</p>
                                <p className='text-left ml-5'>{skill.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Rating</h2>
                        <p>Average: {user.rating.average}</p>
                        <p>Total: {user.rating.total}</p>
                    </div>
                    <div className='bg-white shadow-lg rounded-lg rouneded-lg overflow-hidden p-4 h-auto'>
                        <h2 className='text-2xl font-semibold'>Other Jobs Scheduled For</h2>
                        {user.reservedTime.map((time, index) => (
                            <div key={index} className='mb-2'>
                                <p>{time.dateStart} - {time.dateEnd}</p>
                                <p>{time.timeStart} - {time.timeEnd}</p>
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
