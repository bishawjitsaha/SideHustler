// Example of a home.js route file
import { Router } from 'express';
const router = Router();
import { getUserByUserName, updateUserById } from '../data/users.js';
import { getPostsByUsername } from '../data/posts.js';

router.route('/:username')
    .get(async(req, res) => {
        try{
          const user = await getUserByUserName(`${req.params.username}`);
          if(!user) return res.status(404).json({message: 'User not found'});
          const posts = await getPostsByUsername(`${req.params.username}`);
          if(!posts) return res.status(404).json({message: 'Posts not found'});
          user.posts = posts;
            return res.status(200).json(
              user            )
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
          bio: bio || user.bio,
          ...(school || user.education.school || degree || user.education.degree || major || user.education.major || gradYear || user.education.gradYear // if any education field is provided
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
          skills: user.skills && user.skills.length > 0 // if user has skills
            ? [
                ...user.skills.map((skill) => {
                  if (skillsList === skill.name) { // Check if the skillsList matches the skill name
                    return { // Update the matching skill object
                      ...skill,
                      name: name || skill.name,
                      description: description || skill.description
                    };
                  } else { // Return the skill object as is
                    return skill;
                  }
                }),
                ...(!user.skills.some(skill => skill.name === skillsList) && name && description // Add a new skill if skillsList doesn't match any existing skill
                  ? [{
                      name: name,
                      description: description
                    }]
                  : [])
              ]
            : (name && description && user.skills.length === 0) // if user has no skills
            ? [{
                name: name,
                description: description
              }]
            : [] // if user has no skills and no new skills are provided
        }


        if(bio === '') {
          updatedFields.bio = null;
        }

        const id = user._id;
        const updatedUser = await updateUserById(id, updatedFields);

        return res.status(200).json(updatedUser);
      }
      catch (e) {
        res.status(400).json({message: e})
      }
    })

export default router;