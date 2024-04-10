import {React, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { updateUserById, getUserById } from '../../../server/data/users'

function ProfilePage() {
    const [user, setUser] = useState({})
    const { id } = useParams()

    useEffect(() => {
        setUser(getUserById(id))
    }, [id])

  return (
    <div>
        <h1>{user.firstName} {user.lastName}</h1>
        <h2>Email: {user.email}</h2>
        <h2>Bio</h2>
        <p>{user.bio}</p>
        <h2>Education</h2>
        <ul>
            {user.education.map(edu => (
                <div>
                    <h3>{edu.school}</h3>
                    <h4>{edu.degree}</h4>
                    <p>{edu.major}</p>
                    <p>{edu.gradYear}</p>
                </div>
            ))}
        </ul>
        <h2>Job Experience</h2>
        <ul>
            {user.experience.map(exp => (
                <div>
                    <h3>{exp.company}</h3>
                    <h4>{exp.position}</h4>
                    <p>{exp.startDate} - {exp.endDate}</p>
                </div>
            ))}
        </ul>
        <h2>Skills</h2>
        <ul>
            {user.skills.map(skill => (
                <div>
                    <h3>{skill.name}</h3>
                    <p>{skill.description}</p>
                </div>
            ))}
        </ul>
        <h2>Rating</h2>
        <p>Average: {user.rating.average} Total:{user.rating.total} ratings</p>
        <h2>Unavailable Times</h2>
        <ul>
            {user.unAvailable.map(time => (
                <div>
                    <p>{time.dateStart} - {time.dateEnd}</p>
                    <p>{time.timeStart} - {time.timeEnd}</p>
                </div>
            ))}
        </ul>
    </div>
  )
}

export default ProfilePage
