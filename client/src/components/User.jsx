import React from "react";
import { Link } from "react-router-dom";

const User = ({ user }) => {
  return (
    <Link to={`/user/${user.username}`} className="block">
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">{`${user.firstName} ${user.lastName}`}</h2>

        <p className="text-gray-800 mb-4">{user.bio}</p>

        <div className="flex justify-between text-gray-600 mb-4">
          <p className="font-semibold">Email:</p>
          <p>{user.email}</p>
        </div>

        <div className="flex justify-between text-gray-600 mb-4">
          <p className="font-semibold">Username:</p>
          <p>{user.username}</p>
        </div>

        <div className="border-t border-gray-300 pt-4 mt-4">
          <h3 className="text-lg font-bold mb-2 text-blue-700">Education</h3>
          <p><span className="font-semibold">School:</span> {user.education.school || "Not provided"}</p>
          <p><span className="font-semibold">Degree:</span> {user.education.degree || "Not provided"}</p>
          <p><span className="font-semibold">Major:</span> {user.education.major || "Not provided"}</p>
          <p><span className="font-semibold">Graduation Year:</span> {user.education.gradYear || "Not provided"}</p>
        </div>

        <div className="border-t border-gray-300 pt-4 mt-4">
          <h3 className="text-lg font-bold mb-2 text-blue-700">Skills</h3>
          {user.skills.length > 0 ? (
            <ul>
              {user.skills.map((skill, index) => (
                <li key={index} className="mb-2">
                  <p className="font-semibold">{skill.name}</p>
                  <p className="text-sm text-gray-700">{skill.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No skills listed</p>
          )}
        </div>

        <div className="border-t border-gray-300 pt-4 mt-4">
          <h3 className="text-lg font-bold mb-2 text-blue-700">Experience</h3>
          {user.experience.length > 0 ? (
            <ul>
              {user.experience.map((exp, index) => (
                <li key={index} className="mb-4">
                  <p className="font-semibold">{exp.position}</p>
                  <p className="text-gray-700">{exp.company}</p>
                  <p className="text-gray-600">{`${exp.startDate} - ${exp.endDate}`}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No work experience listed</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default User;
