// Example of a home.js route file
import { Router } from 'express';
const router = Router();
import { getUserByUserName, updateUserById } from '../data/users.js';
import { validateUsername, validateName, validateEmail, validateAge, validateBio, validateExperience, validateEducation, validateSkills } from '../validation/userValidation.js';

router.route('/:username')
    .get(async(req, res) => {
        try{
          const user = await getUserByUserName(`${req.params.username}`);
            return res.status(200).json(
              user
            )
        }
        catch (err) {
            res.status(400).json({message: err.message})
        }
    })
    .post(async (req, res) => {
      try{
        const user = await getUserByUserName(req.params.username);
        if(!user) return res.status(404).json({message: 'User not found'});

        const { 
          userName, 
          firstName, 
          lastName, 
          email, 
          bio,
          school,
          degree,
          major,
          gradYear,
          company,
          position,
          startDate,
          endDate,
          name,
          description
         } = req.body;

         //make error checking function that return null if fields are empty instead of error

        const updatedFields = {
          userName: userName || user.userName,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          email: email || user.email,
          bio: bio || user.bio,
          ...(school || user.education.school || degree || user.education.degree || major || user.education.major || gradYear || user.education.gradYear
            ? {
                  education: {
                      school: school || user.education.school,
                      degree: degree || user.education.degree,
                      major: major || user.education.major,
                      gradYear: gradYear || user.education.gradYear
                  }
              }
            : {}),
            experience: user.experience && user.experience.length > 0
              ? user.experience.map((exp, index) => {
                  return {
                      company: company || exp.company,
                      position: position || exp.position,
                      startDate: startDate || exp.startDate,
                      endDate: endDate || exp.endDate
                  }
                })
              : [{
                  company: company,
                  position: position,
                  startDate: startDate,
                  endDate: endDate
                }],
          skills: user.skills && user.skills.length > 0
            ? user.skills.map((skill, index) => {
                return {
                    name: name || skill.name,
                    description: description || skill.description
                }
              })
            : [{
                name: name,
                description: description
              }]
        }

        const id = user._id;
        const updatedUser = await updateUserById(id, updatedFields);

        return res.status(200).json(updatedUser);
      }
      catch (e) {
        res.status(400).json({message: e.message})
      }
    })

export default router;
