import {React, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
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
            console.log(e);
        }
        
    }

    useEffect(() => {
        fetchData();
    }, [])
    

  return (
    <div>
        {user && (
            <div>
                <h1>{user.firstName} {user.lastName}</h1>
                <p>{user.email}</p>
                <p>{user.bio}</p>
                <p>{user.education.school}</p>
                <p>{user.education.degree}</p>
                <p>{user.education.major}</p>
                <p>{user.education.gradYear}</p>
                <ul>
                    {user.experience.map((exp) => (
                        <li>
                            <p>{exp.company}</p>
                            <p>{exp.position}</p>
                            <p>{exp.startDate}</p>
                            <p>{exp.endDate}</p>
                        </li>
                    ))}
                </ul>
                <ul>
                    {user.skills.map((skill) => (
                        <li>
                            <p>{skill.name}</p>
                            <p>{skill.description}</p>
                        </li>
                    ))}
                </ul>
                <p>{user.rating.average}</p>
                <p>{user.rating.total}</p>
                <ul>
                    {user.reservedTime.map((time) => (
                        <li>
                            <p>{time.dateStart}</p>
                            <p>{time.timeStart}</p>
                            <p>{time.timeEnd}</p>
                            <p>{time.dateEnd}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  )
}

export default ProfilePage
