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
          companyList,
          company,
          position,
          startDate,
          endDate,
          skillsList,
          name,
          description
         } = req.body;

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
            experience: user.experience && user.experience.length > 0 // if user has experiences
            ? [
                ...user.experience.map((exp) => {
                  if (companyList === exp.company) { // Check if the company matches the companyList
                    // Update the matching experience object
                    return {
                      ...exp,
                      company: company || exp.company,
                      position: position || exp.position,
                      startDate: startDate || exp.startDate,
                      endDate: endDate || exp.endDate
                    };
                  } else {
                    return exp;
                  }
                }),
                // Add a new experience if companyList doesn't match any existing company
                ...(!user.experience.some(exp => exp.company === companyList) && company && position && startDate && endDate
                  ? [{
                      company: company,
                      position: position,
                      startDate: startDate,
                      endDate: endDate
                    }]
                  : [])
              ]
            : (company && position && startDate && endDate && user.experience.length === 0) // if user has no experiences
            ? [{
                company: company,
                position: position,
                startDate: startDate,
                endDate: endDate
              }]
            : [],
          skills: user.skills && user.skills.length > 0
            ? [
                ...user.skills.map((skill) => {
                  if (skillsList === skill.name) {
                    return {
                      ...skill,
                      name: name || skill.name,
                      description: description || skill.description
                    };
                  } else {
                    return skill;
                  }
                }),
                ...(!user.skills.some(skill => skill.name === skillsList) && name && description
                  ? [{
                      name: name,
                      description: description
                    }]
                  : [])
              ]
            : (name && description && user.skills.length === 0)
            ? [{
                name: name,
                description: description
              }]
            : []
        }

        if(companyList && company) {
          updatedFields.experience = user.experience.map((exp, index) => {
            if(companyList === exp.company) {
              return {
                ...exp,
                company: company,
                position: position || exp.position,
                startDate: startDate || exp.startDate,
                endDate: endDate || exp.endDate
              }
            }
            else {
              return exp
            }
          })
        }

        if(skillsList) {
          updatedFields.skills = user.skills.map((skill, index) => {
            return {
              name: skillsList === skill.name ? name : skill.name,
              description: skillsList === skill.name ? description : skill.description
            }
          })
        }

        if(bio === '') {
          updatedFields.bio = null;
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
