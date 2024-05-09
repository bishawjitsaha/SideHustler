import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import * as userData from '../data/users.js';
import * as postData from '../data/posts.js';
import { createNotification } from "../data/notifications.js";
import { createChat } from "../data/messages.js";
import { uploadPfP, uploadPostImage } from '../data/images.js';
import { firebase } from "../firebase/serverconfig.js";
import fs from 'fs';
import path from "path";
import { getStorage } from 'firebase-admin/storage';

const auth = firebase.auth();

let userRecord1;
let userRecord2;
let userRecord3;
let userRecord4;
let userRecord5;
let userRecord6;
let userRecord7;
let userRecord8;
let userRecord9;
let userRecord10;


/*
const tags = [
        "Assembly",
        "Childcare",
        "Cleaning",
        "Delivery",
        "Design",
        "Handywork",
        "Indoors",
        "Installation",
        "IT Support",
        "Lawn Care",
        "Moving",
        "Outdoors",
        "Painting",
        "Petcare",
        "Photography",
        "Tutoring",
        "Wellness",
    ]);
*/
const createFireBaseUsers = async () => {
    //First check if the users exist, then return the uids if they exists, using the getUserByEmail(email)
    try{
        userRecord1 = await auth.getUserByEmail("johndoe@gmail.com")
    }catch(e){
        userRecord1 = await auth.createUser({
            email: "johndoe@gmail.com",
            password: "j0hnsPa$$word",
            displayName: "JohnDoe",
        });
        console.log("Created user:", userRecord1.uid);
    }

    try{
        userRecord2 = await auth.getUserByEmail("janesmith@hotmail.com")
    }catch(e){
        userRecord2 = await auth.createUser({
            email: "janesmith@hotmail.com",
            password: "j4n3sPa$$word",
            displayName: "JaneSmith",
        });
        console.log("Created user2:", userRecord2.uid);
    }

    try{
        userRecord3 = await auth.getUserByEmail("mikejohnson@yahoo.com")
    }catch(e){
        userRecord3 = await auth.createUser({
            email: "mikejohnson@yahoo.com",
            password: "m1k3sPa$$word",
            displayName: "MikeJohnson",
        });
        console.log("Created user3:", userRecord3.uid);
    }
    
    try{
        userRecord4 = await auth.getUserByEmail("sarahwilson@example.com");
    }catch(e){
        userRecord4 = await auth.createUser({
            email: "sarahwilson@example.com",
            password: "s4r4hsPa$$word",
            displayName: "SarahWilson",
        });
        console.log("Created user4:", userRecord4.uid);
    }
    
    try{
        userRecord5 = await auth.getUserByEmail("michaelbrown@gmail.com");
    }catch(e){
        userRecord5 = await auth.createUser({
            email: "michaelbrown@gmail.com",
            password: "M1ch@3lBr0wn",
            displayName: "MichaelBrown",
        });
        console.log("Created user5:", userRecord5.uid);
    }
    
    try{
        userRecord6 = await auth.getUserByEmail("robertsmith@example.com");
    }catch(e){
        userRecord6 = await auth.createUser({
            email: "robertsmith@example.com",
            password: "R0b3rtSm1th",
            displayName: "RobertSmith",
        });
        console.log("Created user6:", userRecord6.uid);
    }
    
    try{
        userRecord7 = await auth.getUserByEmail("emilyjones@example.com");
    }catch(e){
        userRecord7 = await auth.createUser({
            email: "emilyjones@example.com",
            password: "3m1lyJ0n3s",
            displayName: "EmilyJones",
        });
        console.log("Created user7:", userRecord7.uid);
    }
    
    try{
        userRecord8 = await auth.getUserByEmail("davidwilson@example.com");
    }catch(e){
        userRecord8 = await auth.createUser({
            email: "davidwilson@example.com",
            password: "Dav1dW1ls0n",
            displayName: "DavidWilson",
        });
        console.log("Created user8:", userRecord8.uid);
    }
    
    try{
        userRecord9 = await auth.getUserByEmail("amandasmith@example.com");
    }catch(e){
        userRecord9 = await auth.createUser({
            email: "amandasmith@example.com",
            password: "Am4ndaSm1th",
            displayName: "AmandaSmith",
        });
        console.log("Created user9:", userRecord9.uid);
    }
    
    try{
        userRecord10 = await auth.getUserByEmail("alexanderbrown@example.com");
    }catch(e){
        userRecord10 = await auth.createUser({
            email: "alexanderbrown@example.com",
            password: "Al3x@nd3rBr0wn",
            displayName: "AlexanderBrown",
        });
        console.log("Created user10:", userRecord10.uid);
    }
    
    
}

const applyToPost = async (userId, postId) => {
    try {
        const uid = userId

        let updatedPost = await postData.addApplicant(postId, uid);

        // notify the posterID that someone has applied
        const post = await postData.getPostById(postId);
        const getApplicant = await userData.getUserById(uid);

        const noti = await createNotification(post.posterId,
            "post",
            getApplicant.userName + "has applied to your post ",
            `/user/${getApplicant.userName}`
        );

        //notify the applicant that they have applied
        const applicantNoti = await createNotification(uid,
            "post",
            "You have applied to a post",
            `/post/${postId}`
        );
    } catch (e) {
        console.log(e);
        throw `Error applying to post: ${e}`;
    }
}

const chooseApplicant = async (postId, applicantId) => {
    try {
        let updatedApplicant = await userData.updateSelectedApplicant(postId, applicantId);
        const currPost = await postData.getPostById(postId);
        if (applicantId !== null) {
            // notify the selected applicant that they have been chosen
            const selectedAppNoti = await createNotification(applicantId,
                "post",
                "You have been chosen for a post",
                `/post/${postId}`
            );
            
            // notify the chooser that they have successfully chosen an applicant
            const postOwnerNoti = await createNotification(currPost.posterId,
                "post", 
                "You have successfully chosen an applicant: " + updatedApplicant.userName,
                `/user/${updatedApplicant.userName}`
            );
            
            const currUser = await userData.getUserById(currPost.posterId);
            
            // open up a chat between them
            const newChat = createChat(updatedApplicant.userName, currUser.userName);
        } else if (applicantId === null && currPost.selectedApplicant !== null) {
            const unChosenUser = await userData.getUserById(currPost.selectedApplicant);
            
            const postOwnerNoti = await createNotification(currPost.posterId,
                "post",
                "You have unchosen an applicant: " + unChosenUser.userName,
                `/user/${unChosenUser.userName}`
            );
            
        }
        
        let updatedPost = await postData.updatePostById(
            postId,
            {selectedApplicant: applicantId}
        );
        
        let status = applicantId ? "In progress" : "Open"
        
        let updatedStatus = await postData.updatePostStatus(
            postId,
            status
        );
        // return res.status(200).json({ post: updatedPost });
    } catch (e) {
        console.log(e);
        throw `Error applying to post: ${e}`;
        // res.status(404).json({ error: e });
    }
}

const completePost = async (postId) => {
    try {
        let updatedPost = await postData.updatePostStatus(postId, "completed" );
        // return res.status(200).json({ post: updatedPost });
    } catch (e) {
        console.log(e);
        throw `Error Completing post: ${e}`;
        // res.status(404).json({ error: e });
    }
}

const copyFileToUploads = async (sourcePath) => {
    const fileName = path.basename(sourcePath);
    const destinationPath = path.join('../server/uploads/', fileName);
  
    return new Promise((resolve, reject) => {
      fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(destinationPath);
        }
      });
    });
};



const main = async () => {
    try {
        //drop firebase users
        auth.listUsers().then((listUsersResult) => {
            const promises = listUsersResult.users.map((userRecord) => {
                return auth.deleteUser(userRecord.uid);
              });
              return Promise.all(promises);
            })
            .then(() => {
              console.log('All users deleted successfully');
            })
            .catch((error) => {
              console.error('Error deleting users:', error);
            });


        // Drop Firebase Storage
        const storage = getStorage(firebase);
        const bucketRef = storage.bucket();
        await bucketRef.deleteFiles({
            force: true
        });

        // Drop the database
        await createFireBaseUsers();
        const db = await dbConnection();
        await db.dropDatabase();
        console.log('Database dropped successfully!');

        console.log('Seeding database...');

        // Create dummy users
        const user1 = await userData.createUser(
            userRecord1.uid,
            "JohnDoe",
            "John",
            "Doe",
            "johndoe@gmail.com",
            32,
            false
        );

        // Update user 1 with additional fields
        await userData.updateUserById(user1._id, {
            pfp: "https://example.com/johndoe-profile.jpg",
            bio: "I'm a software engineer with 10 years of experience.",
            education: {
                school: "University of Technology",
                degree: "Bachelors",
                major: "Computer Science",
                gradYear: "2012",
            },
            experience: [
                {
                    company: "Tech Inc",
                    position: "Senior Software Engineer",
                    startDate: "2012-06-01",
                    endDate: "2022-03-31",
                },
            ],
            skills: [
                {
                    name: "JavaScript",
                    description: "Proficient in modern JavaScript development",
                },
                {
                    name: "Nodejs",
                    description:
                        "Experienced in building server side applications with Nodejs",
                },
            ],
            rating: {
                average: 4.8,
                total: 35,
            },
            reservedTime: [
                // {
                //     dateStart: "2023-04-10",
                //     timeStart: "10:00",
                //     timeEnd: "15:00",
                //     dateEnd: "2023-04-10",
                // },
                // {
                //     dateStart: "2023-05-01",
                //     timeStart: "14:00",
                //     timeEnd: "18:00",
                //     dateEnd: "2023-05-01",
                // },
            ],
        });

        // Create user 2
        const user2 = await userData.createUser(
            userRecord2.uid,
            "JaneSmith",
            "Jane",
            "Smith",
            "janesmith@hotmail.com",
            28,
            false
        );

        await userData.updateUserById(user2._id, {
            pfp: "https://example.com/janesmith-profile.jpg",
            bio: "I'm a graphic designer with 5 years of experience.",
            education: {
                school: "Art Institute of Example",
                degree: "Bachelors",
                major: "Graphic Design",
                gradYear: "2017",
            },
            experience: [
                {
                    company: "Design Studio LLC",
                    position: "Graphic Designer",
                    startDate: "2017-09-01",
                    endDate: "2022-04-30",
                },
            ],
            skills: [
                {
                    name: "Adobe Creative Cloud",
                    description:
                        "Proficient in Photoshop Illustrator and InDesign",
                },
                {
                    name: "Typography",
                    description:
                        "Strong understanding of typography and design principles",
                },
            ],
            rating: {
                average: 4.5,
                total: 20,
            },
            reservedTime: [
                // {
                //     dateStart: "2023-04-15",
                //     timeStart: "11:00",
                //     timeEnd: "16:00",
                //     dateEnd: "2023-04-15",
                // },
                // {
                //     dateStart: "2023-05-05",
                //     timeStart: "09:00",
                //     timeEnd: "14:00",
                //     dateEnd: "2023-05-05",
                // },
            ],
        });

        const user3 = await userData.createUser(
            userRecord3.uid,
            "MikeJohnson",
            "Mike",
            "Johnson",
            "mikejohnson@yahoo.com",
            41,
            false
        );

        await userData.updateUserById(user3._id, {
            pfp: "https://example.com/mikejohnson-profile.jpg",
            bio: "I'm a marketing manager with 15 years of experience.",
            education: {
                school: "State University",
                degree: "Masters",
                major: "Marketing",
                gradYear: "2008",
            },
            experience: [
                {
                    company: "Marketing Solutions Inc",
                    position: "Marketing Manager",
                    startDate: "2008-06-01",
                    endDate: "2023-03-31",
                },
            ],
            skills: [
                {
                    name: "Digital Marketing",
                    description:
                        "Experienced in various digital marketing strategies",
                },
                {
                    name: "Team Management",
                    description:
                        "Skilled in leading and managing marketing teams",
                },
            ],
            rating: {
                average: 4.2,
                total: 25,
            },
            reservedTime: [
                // {
                //     dateStart: "2023-04-20",
                //     timeStart: "13:00",
                //     timeEnd: "17:00",
                //     dateEnd: "2023-04-20",
                // },
                // {
                //     dateStart: "2023-05-10",
                //     timeStart: "08:00",
                //     timeEnd: "12:00",
                //     dateEnd: "2023-05-10",
                // },
            ],
        });

        const user4 = await userData.createUser(
            userRecord4.uid,
            "SarahWilson",
            "Sarah",
            "Wilson",
            "sarahwilson@example.com",
            25,
            false
        );

        await userData.updateUserById(user4._id, {
            pfp: "https://example.com/sarahwilson-profile.jpg",
            bio: "I'm a marketing intern with a passion for social media marketing.",
            education: {
                school: "State College",
                degree: "Bachelors",
                major: "Marketing",
                gradYear: "2020",
            },
            experience: [
                {
                    company: "Social Media Agency",
                    position: "Marketing Intern",
                    startDate: "2020-06-01",
                    endDate: "2021-08-31",
                },
            ],
            skills: [
                {
                    name: "Social Media Management",
                    description:
                        "Experienced in managing social media accounts and campaigns",
                },
                {
                    name: "Content Creation",
                    description:
                        "Skilled in creating engaging content for various platforms",
                },
            ],
            rating: {
                average: 4.3,
                total: 15,
            },
            reservedTime: [
                // {
                //     dateStart: "2021-04-25",
                //     timeStart: "09:00",
                //     timeEnd: "13:00",
                //     dateEnd: "2023-04-25",
                // },
                // {
                //     dateStart: "2023-05-15",
                //     timeStart: "14:00",
                //     timeEnd: "18:00",
                //     dateEnd: "2023-05-15",
                // },
            ],
        });

        const user5 = await userData.createUser(
            userRecord5.uid,
            "MichaelBrown",
            "Michael",
            "Brown",
            "michaelbrown@gmail.com",
            43,
            false
        );

        await userData.updateUserById(user5._id, {
            pfp: "https://example.com/michaelbrown-profile.jpg",
            bio: "I'm a plumber with 5 years of experience. Specializing in residential plumbing services.",
            education: {
                school: "Plumber's Academy",
                degree: "Plumbing Certification",
                major: "Plumbing",
                gradYear: "2018",
            },
            experience: [
                {
                    company: "Plumb Rite Services",
                    position: "Plumber",
                    startDate: "2018-07-01",
                    endDate: "2023-06-30",
                },
            ],
            skills: [
                {
                    name: "Pipe Installation",
                    description: "Proficient in installing and repairing pipes for residential and commercial properties",
                },
                {
                    name: "Fixture Repair",
                    description: "Skilled in repairing and replacing plumbing fixtures such as faucets toilets and sinks",
                },
                {
                    name: "Drain Cleaning",
                    description: "Experienced in clearing clogged drains using various plumbing tools and techniques.",
                },
            ],
            rating: {
                average: 4.7,
                total: 25,
            },
            reservedTime: [
                // {
                //     dateStart: "2023-05-10",
                //     timeStart: "09:00",
                //     timeEnd: "12:00",
                //     dateEnd: "2023-05-10",
                // },
                // {
                //     dateStart: "2023-05-15",
                //     timeStart: "13:00",
                //     timeEnd: "17:00",
                //     dateEnd: "2023-05-15",
                // },
            ],
        });

        
        const user6 = await userData.createUser(
            userRecord6.uid,
            "RobertSmith",
            "Robert",
            "Smith",
            "robertsmith@example.com",
            35,
            false
        );
        await userData.updateUserById(user6._id, {
            pfp: "https://example.com/robertsmith-profile.jpg",
            bio: "I'm a teacher with 10 years of experience. Specializing in mathematics education.",
            education: {
                school: "State University",
                degree: "Master's",
                major: "Education",
                gradYear: "2012",
            },
            experience: [
                {
                    company: "City High School",
                    position: "Mathematics Teacher",
                    startDate: "2012-08-01",
                    endDate: "2022-07-31",
                },
            ],
            skills: [
                {
                    name: "Mathematics Education",
                    description: "Experienced in teaching various mathematical concepts to high school students.",
                },
                {
                    name: "Curriculum Development",
                    description: "Skilled in developing engaging and effective math curriculum materials.",
                },
            ],
            rating: {
                average: 4.6,
                total: 30,
            },
            reservedTime: [],
        });

        
        const user7 = await userData.createUser(
            userRecord7.uid,
            "EmilyJones",
            "Emily",
            "Jones",
            "emilyjones@example.com",
            29,
            false
        );
        await userData.updateUserById(user7._id, {
            pfp: "https://example.com/emilyjones-profile.jpg",
            bio: "I'm a nurse with 6 years of experience. Passionate about providing quality patient care.",
            education: {
                school: "Community College",
                degree: "Associate's",
                major: "Nursing",
                gradYear: "2018",
            },
            experience: [
                {
                    company: "City Hospital",
                    position: "Registered Nurse",
                    startDate: "2018-07-01",
                    endDate: "2024-04-30",
                },
            ],
            skills: [
                {
                    name: "Patient Care",
                    description: "Skilled in providing compassionate and effective patient care in various healthcare settings.",
                },
                {
                    name: "Medical Procedures",
                    description: "Experienced in performing various medical procedures and treatments under supervision.",
                },
            ],
            rating: {
                average: 4.9,
                total: 40,
            },
            reservedTime: [],
        });

        
        const user8 = await userData.createUser(
            userRecord8.uid,
            "DavidWilson",
            "David",
            "Wilson",
            "davidwilson@example.com",
            38,
            false
        );
        await userData.updateUserById(user8._id, {
            pfp: "https://example.com/davidwilson-profile.jpg",
            bio: "I'm a lawyer with 12 years of experience. Specializing in corporate law and litigation.",
            education: {
                school: "Law School",
                degree: "Juris Doctor",
                major: "Law",
                gradYear: "2010",
            },
            experience: [
                {
                    company: "Wilson and Associates Law Firm",
                    position: "Senior Attorney",
                    startDate: "2010-09-01",
                    endDate: "2024-08-31",
                },
            ],
            skills: [
                {
                    name: "Corporate Law",
                    description: "Experienced in providing legal counsel and representation to corporations and businesses.",
                },
                {
                    name: "Litigation",
                    description: "Skilled in representing clients in civil litigation cases in state and federal courts.",
                },
            ],
            rating: {
                average: 4.7,
                total: 50,
            },
            reservedTime: [],
        });

        
        const user9 = await userData.createUser(
            userRecord9.uid,
            "AmandaSmith",
            "Amanda",
            "Smith",
            "amandasmith@example.com",
            27,
            false
        );
        await userData.updateUserById(user9._id, {
            pfp: "https://example.com/amandasmith-profile.jpg",
            bio: "I'm a fitness trainer with 5 years of experience. Dedicated to helping clients achieve their fitness goals.",
            education: {
                school: "Fitness Institute",
                degree: "Certification",
                major: "Fitness Training",
                gradYear: "2017",
            },
            experience: [
                {
                    company: "Fit For Life Gym",
                    position: "Fitness Trainer",
                    startDate: "2017-08-01",
                    endDate: "2024-05-08",
                },
            ],
            skills: [
                {
                    name: "Personal Training",
                    description: "Experienced in designing personalized fitness programs for clients of all fitness levels.",
                },
                {
                    name: "Nutrition Counseling",
                    description: "Skilled in providing dietary guidance and meal planning to support fitness goals.",
                },
            ],
            rating: {
                average: 4.9,
                total: 60,
            },
            reservedTime: [],
        });

        
        const user10 = await userData.createUser(
            userRecord10.uid,
            "AlexanderBrown",
            "Alexander",
            "Brown",
            "alexanderbrown@example.com",
            31,
            false
        );
        await userData.updateUserById(user10._id, {
            pfp: "https://example.com/alexanderbrown-profile.jpg",
            bio: "I'm a financial advisor with 8 years of experience. Helping clients achieve their financial goals.",
            education: {
                school: "Finance Institute",
                degree: "Bachelor's",
                major: "Finance",
                gradYear: "2014",
            },
            experience: [
                {
                    company: "Brown Financial Services",
                    position: "Financial Advisor",
                    startDate: "2014-09-01",
                    endDate: "2024-08-30",
                },
            ],
            skills: [
                {
                    name: "Investment Management",
                    description: "Experienced in developing personalized investment strategies based on client goals and risk tolerance.",
                },
                {
                    name: "Financial Planning",
                    description: "Skilled in creating comprehensive financial plans to help clients achieve their long term objectives.",
                },
            ],
            rating: {
                average: 4.8,
                total: 45,
            },
            reservedTime: [],
        });

        console.log('Dummy users created successfully!');
        //Uploading post pictures
        console.log('Adding Post Pictures');

        let post1Path = "./tasks/Images/Post Images/post1.jpg";
        post1Path = await copyFileToUploads(post1Path);
        post1Path = path.resolve(post1Path);
        const post1url = await uploadPostImage(post1Path);

        let post3Path = "./tasks/Images/Post Images/post3.jpg";
        post3Path = await copyFileToUploads(post3Path);
        post3Path = path.resolve(post3Path);
        const post3url = await uploadPostImage(post3Path);

        let post5Path = "./tasks/Images/Post Images/post5.jpg";
        post5Path = await copyFileToUploads(post5Path);
        post5Path = path.resolve(post5Path);
        const post5url = await uploadPostImage(post5Path);

        let post6Path = "./tasks/Images/Post Images/post6.jpg";
        post6Path = await copyFileToUploads(post6Path);
        post6Path = path.resolve(post6Path);
        const post6url = await uploadPostImage(post6Path);

        let post11Path = "./tasks/Images/Post Images/post11.jpg";
        post11Path = await copyFileToUploads(post11Path);
        post11Path = path.resolve(post11Path);
        const post11url = await uploadPostImage(post11Path);

        let post17Path = "./tasks/Images/Post Images/post17.jpg";
        post17Path = await copyFileToUploads(post17Path);
        post17Path = path.resolve(post17Path);
        const post17url = await uploadPostImage(post17Path);

        let post20Path = "./tasks/Images/Post Images/post20.jpg";
        post20Path = await copyFileToUploads(post20Path);
        post20Path = path.resolve(post20Path);
        const post20url = await uploadPostImage(post20Path);

        console.log('Post Pictures added successfully!');


        // Create dummy posts for tasks or jobs
        const taskTime1 = { dateStart: '2024-06-25', dateEnd: '2024-06-26', timeStart: '17:00', timeEnd: '10:00' };
        const post1 = await postData.createPost(
            "Need a babysitter for the weekend",
            "Looking for a responsible babysitter to watch my two children (ages 5 and 8) for the weekend. Job includes preparing meals, supervising playtime, and ensuring their safety.",
            taskTime1,
            100,
            user1._id,
            post1url,
            "in-person",
            ["Indoors", "Childcare"]
        );

        const taskTime2 = { dateStart: '2024-05-19', dateEnd: '2024-06-30', timeStart: '08:00', timeEnd: '18:00' };
        const post2 = await postData.createPost(
            "Website development needed",
            "Looking for a skilled web developer to create a website for my small business. The website should be responsive, user-friendly, and include an online store.",
            taskTime2,
            2500,
            user2._id,
            null, // Empty array for photos
            "remote",
            ["Design", "IT Support"]
        );

        const taskTime3 = { dateStart: '2024-08-20', dateEnd: '2024-08-20', timeStart: '14:00', timeEnd: '17:00' };
        const post3 = await postData.createPost(
            "Furniture assembly required",
            "Need someone to assemble a new dining table and chairs that I recently purchased. Must have experience with furniture assembly and necessary tools.",
            taskTime3,
            75,
            user3._id,
            post3url, 
            "in-person",
            ["Assembly", "Indoors", "Handywork"]
        );

        const taskTime4 = { dateStart: '2024-05-20', dateEnd: '2024-06-15', timeStart: '16:00', timeEnd: '18:00' };
        const post4 = await postData.createPost(
            "Seeking a math tutor for high school student",
            "Looking for a math tutor to help my high school student prepare for upcoming exams. Tutoring sessions should cover algebra, geometry, and trigonometry.",
            taskTime4,
            30,
            user4._id,
            null, // Empty array for photos
            "remote",
            ["Tutoring"]
        );

        const taskTime5 = { dateStart: '2024-07-01', dateEnd: '2024-07-15', timeStart: '09:00', timeEnd: '17:00' };
        const post5 = await postData.createPost(
            "Plumbing repairs needed",
            "Need a plumber to fix a leaky faucet and unclog a drain in my bathroom. Must be experienced and bring necessary tools.",
            taskTime5,
            150,
            user5._id,
            post5url, 
            "in-person",
            ["Indoors", "Handywork"]
        );

        const taskTime6 = { dateStart: '2024-06-01', dateEnd: '2024-08-31', timeStart: '13:00', timeEnd: '16:00' };
        const post6 = await postData.createPost(
            "Tutoring for high school math",
            "Experienced math teacher offering tutoring services for high school students struggling with algebra, geometry, and calculus.",
            taskTime6,
            40,
            user6._id,
            post6url,
            "in-person",
            ["Tutoring"]
        );

        const taskTime7 = { dateStart: '2024-09-01', dateEnd: '2024-09-30', timeStart: '08:00', timeEnd: '16:00' };
        const post7 = await postData.createPost(
            "Nursing assistance needed",
            "Looking for a registered nurse to assist with post-operative care and medication management for an elderly patient.",
            taskTime7,
            25,
            user7._id,
            null, // Empty array for photos
            "in-person",
            ["Wellness", "Indoors"]
        );

        const taskTime8 = { dateStart: '2024-06-15', dateEnd: '2024-07-31', timeStart: '10:00', timeEnd: '18:00' };
        const post8 = await postData.createPost(
            "Legal consultation for small business",
            "Seeking a corporate lawyer to provide legal advice and guidance for setting up a new small business. Experience with contracts and compliance is a must.",
            taskTime8,
            1000,
            user8._id,
            null, // Empty array for photos
            "remote",
            ["IT Support"]
        );

        const taskTime9 = { dateStart: '2024-07-01', dateEnd: '2024-08-31', timeStart: '06:00', timeEnd: '10:00' };
        const post9 = await postData.createPost(
            "Personal fitness training",
            "Certified fitness trainer offering personalized workout plans and one-on-one training sessions to help clients achieve their fitness goals.",
            taskTime9,
            60,
            user9._id,
            null, // Empty array for photos
            "in-person",
            ["Wellness", "Outdoors"]
        );

        const taskTime10 = { dateStart: '2024-05-15', dateEnd: '2024-06-30', timeStart: '14:00', timeEnd: '18:00' };
        const post10 = await postData.createPost(
            "Financial planning for retirement",
            "Looking for an experienced financial advisor to help plan for retirement and create a solid investment strategy.",
            taskTime10,
            500,
            user10._id,
            null, // Empty array for photos
            "remote",
            ["IT Support"]
        );

        const taskTime11 = { dateStart: '2024-06-01', dateEnd: '2024-06-30', timeStart: '09:00', timeEnd: '17:00' };
        const post11 = await postData.createPost(
            "Lawn mowing and landscaping",
            "Need someone to mow my lawn and perform basic landscaping tasks like trimming bushes and weeding flower beds.",
            taskTime11,
            80,
            user1._id,
            post11url, 
            "in-person",
            ["Outdoors", "Lawn Care"]
        );

        const taskTime12 = { dateStart: '2024-07-01', dateEnd: '2024-07-31', timeStart: '10:00', timeEnd: '16:00' };
        const post12 = await postData.createPost(
            "Logo and branding design",
            "Looking for a talented graphic designer to create a new logo and branding materials for my startup company.",
            taskTime12,
            800,
            user2._id,
            null, // Empty array for photos
            "remote",
            ["Design", "IT Support"]
        );

        const taskTime13 = { dateStart: '2024-08-01', dateEnd: '2024-08-15', timeStart: '08:00', timeEnd: '12:00' };
        const post13 = await postData.createPost(
            "Moving assistance needed",
            "Need a few strong individuals to help with moving furniture and boxes to a new apartment. Must have a truck for transportation.",
            taskTime13,
            200,
            user3._id,
            null, // Empty array for photos
            "in-person",
            ["Moving", "Handywork"]
        );

        const taskTime14 = { dateStart: '2024-09-01', dateEnd: '2024-09-30', timeStart: '13:00', timeEnd: '18:00' };
        const post14 = await postData.createPost(
            "Tutoring for SAT/ACT prep",
            "Experienced tutor offering personalized SAT and ACT preparation sessions to help high school students achieve their target scores.",
            taskTime14,
            50,
            user4._id,
            null, // Empty array for photos
            "remote",
            ["Tutoring"]
        );

        const taskTime15 = { dateStart: '2024-10-01', dateEnd: '2024-10-31', timeStart: '09:00', timeEnd: '17:00' };
        const post15 = await postData.createPost(
            "Bathroom renovation project",
            "Looking for a skilled contractor to renovate my bathroom, including installing new tiles, fixtures, and a walk-in shower.",
            taskTime15,
            3000,
            user5._id,
            null, // Empty array for photos
            "in-person",
            ["Indoors", "Handywork", "Installation"]
        );

        const taskTime16 = { dateStart: '2024-06-01', dateEnd: '2024-08-31', timeStart: '14:00', timeEnd: '18:00' };
        const post16 = await postData.createPost(
            "Summer tutoring for elementary students",
            "Experienced elementary school teacher offering tutoring services in various subjects to help students catch up or get ahead during the summer break.",
            taskTime16,
            30,
            user6._id,
            null, // Empty array for photos
            "remote",
            ["Tutoring"]
        );

        const taskTime17 = { dateStart: '2024-07-01', dateEnd: '2024-07-31', timeStart: '10:00', timeEnd: '14:00' };
        const post17 = await postData.createPost(
            "Pet sitting services",
            "Reliable and experienced pet sitter offering daily visits to feed, walk, and play with pets while owners are away.",
            taskTime17,
            20,
            user7._id,
            post17url,
            "in-person",
            ["Petcare", "Outdoors"]
        );

        const taskTime18 = { dateStart: '2024-09-01', dateEnd: '2024-10-31', timeStart: '09:00', timeEnd: '17:00' };
        const post18 = await postData.createPost(
            "Contract review and negotiation",
            "Experienced corporate lawyer offering contract review and negotiation services for businesses of all sizes.",
            taskTime18,
            1500,
            user8._id,
            null, // Empty array for photos
            "remote",
            ["IT Support"]
        );

        const taskTime19 = { dateStart: '2024-08-01', dateEnd: '2024-08-31', timeStart: '06:00', timeEnd: '10:00' };
        const post19 = await postData.createPost(
            "Outdoor bootcamp fitness classes",
            "Certified fitness trainer offering high-intensity outdoor bootcamp classes to help individuals get in shape and improve overall fitness.",
            taskTime19,
            40,
            user9._id,
            null, // Empty array for photos
            "in-person",
            ["Wellness", "Outdoors"]
        );

        const taskTime20 = { dateStart: '2024-07-01', dateEnd: '2024-08-31', timeStart: '14:00', timeEnd: '18:00' };
        const post20 = await postData.createPost(
            "Investment portfolio review",
            "Experienced financial advisor offering comprehensive review and analysis of investment portfolios, with recommendations for optimization and risk management.",
            taskTime20,
            750,
            user10._id,
            post20url,
            "remote",
            ["IT Support"]
        );

        console.log('Dummy posts created successfully!');

        
        // Users applying to posts
        // User 1 created post1, post11
        await applyToPost(user2._id, post1._id); // User 2 applying to post1
        await applyToPost(user3._id, post1._id); // User 3 applying to post1
        await applyToPost(user7._id, post1._id); // User 7 applying to post1

        await applyToPost(user5._id, post11._id); // User 5 applying to post11
        await applyToPost(user6._id, post11._id); // User 6 applying to post11

        // User 2 created post2, post12
        await applyToPost(user1._id, post2._id); // User 1 applying to post2
        await applyToPost(user6._id, post2._id); // User 6 applying to post2
        await applyToPost(user10._id, post2._id); // User 10 applying to post2

        await applyToPost(user4._id, post12._id); // User 4 applying to post12
        await applyToPost(user7._id, post12._id); // User 7 applying to post12

        // User 3 created post3, post13
        await applyToPost(user5._id, post3._id); // User 5 applying to post3
        await applyToPost(user8._id, post3._id); // User 8 applying to post3

        await applyToPost(user1._id, post13._id); // User 1 applying to post13
        await applyToPost(user9._id, post13._id); // User 9 applying to post13

        // User 4 created post4, post14
        await applyToPost(user6._id, post4._id); // User 6 applying to post4
        await applyToPost(user9._id, post4._id); // User 9 applying to post4

        await applyToPost(user2._id, post14._id); // User 2 applying to post14
        await applyToPost(user7._id, post14._id); // User 7 applying to post14

        // User 5 created post5, post15
        await applyToPost(user1._id, post5._id); // User 1 applying to post5
        await applyToPost(user7._id, post5._id); // User 7 applying to post5

        // No applications for post15 since it's a renovation project

        // User 6 created post6, post16
        await applyToPost(user4._id, post6._id); // User 4 applying to post6
        await applyToPost(user9._id, post6._id); // User 9 applying to post6

        await applyToPost(user3._id, post16._id); // User 3 applying to post16
        await applyToPost(user8._id, post16._id); // User 8 applying to post16

        // User 7 created post7, post17
        await applyToPost(user9._id, post7._id); // User 9 applying to post7

        await applyToPost(user2._id, post17._id); // User 2 applying to post17
        await applyToPost(user5._id, post17._id); // User 5 applying to post17

        // User 8 created post8, post18
        await applyToPost(user1._id, post8._id); // User 1 applying to post8
        await applyToPost(user10._id, post8._id); // User 10 applying to post8

        await applyToPost(user3._id, post18._id); // User 3 applying to post18
        await applyToPost(user6._id, post18._id); // User 6 applying to post18

        // User 9 created post9, post19
        await applyToPost(user2._id, post9._id); // User 2 applying to post9
        await applyToPost(user7._id, post9._id); // User 7 applying to post9

        await applyToPost(user1._id, post19._id); // User 1 applying to post19
        await applyToPost(user4._id, post19._id); // User 4 applying to post19

        // User 10 created post10, post20
        await applyToPost(user8._id, post10._id); // User 8 applying to post10

        await applyToPost(user5._id, post20._id); // User 5 applying to post20
        await applyToPost(user7._id, post20._id); // User 7 applying to post20
        
        console.log('Applications to posts created successfully!');

        // Choose applicants for posts
        await chooseApplicant(post1._id, user3._id);
        await chooseApplicant(post2._id, user10._id);
        await chooseApplicant(post4._id, user6._id);
        await chooseApplicant(post9._id, user2._id);
        await chooseApplicant(post12._id, user4._id);
        await chooseApplicant(post17._id, user5._id);
        await chooseApplicant(post19._id, user1._id);

        console.log('Done choosing applicants for posts!');

        await completePost(post4._id);
        await completePost(post12._id);
        await completePost(post19._id);

        console.log('Done completing posts!');

        console.log('Adding Profile Pictures');

        let AlexanderBrownPfpPath = "./tasks/Images/Profile Images/AlexanderBrown.png";
        AlexanderBrownPfpPath = await copyFileToUploads(AlexanderBrownPfpPath);
        AlexanderBrownPfpPath = path.resolve(AlexanderBrownPfpPath);
        await uploadPfP("AlexanderBrown", AlexanderBrownPfpPath);

        let AmandaSmithPfpPath = "./tasks/Images/Profile Images/AmandaSmith.png";
        AmandaSmithPfpPath = await copyFileToUploads(AmandaSmithPfpPath);
        AmandaSmithPfpPath = path.resolve(AmandaSmithPfpPath);
        await uploadPfP("AmandaSmith", AmandaSmithPfpPath);

        let DavidWilsonPfpPath = "./tasks/Images/Profile Images/DavidWilson.png";
        DavidWilsonPfpPath = await copyFileToUploads(DavidWilsonPfpPath);
        DavidWilsonPfpPath = path.resolve(DavidWilsonPfpPath);
        await uploadPfP("DavidWilson", DavidWilsonPfpPath);

        let EmilyJonesPfpPath = "./tasks/Images/Profile Images/EmilyJones.png";
        EmilyJonesPfpPath = await copyFileToUploads(EmilyJonesPfpPath);
        EmilyJonesPfpPath = path.resolve(EmilyJonesPfpPath);
        await uploadPfP("EmilyJones", EmilyJonesPfpPath);

        let JaneSmithPfpPath = "./tasks/Images/Profile Images/JaneSmith.png";
        JaneSmithPfpPath = await copyFileToUploads(JaneSmithPfpPath);
        JaneSmithPfpPath = path.resolve(JaneSmithPfpPath);
        await uploadPfP("JaneSmith", JaneSmithPfpPath);

        let JohnDoePfpPath = "./tasks/Images/Profile Images/JohnDoe.png";
        JohnDoePfpPath = await copyFileToUploads(JohnDoePfpPath);
        JohnDoePfpPath = path.resolve(JohnDoePfpPath);
        await uploadPfP("JohnDoe", JohnDoePfpPath);

        let MichaelBrownPfpPath = "./tasks/Images/Profile Images/MichaelBrown.png";
        MichaelBrownPfpPath = await copyFileToUploads(MichaelBrownPfpPath);
        MichaelBrownPfpPath = path.resolve(MichaelBrownPfpPath);
        await uploadPfP("MichaelBrown", MichaelBrownPfpPath);

        let MikeJohnsonPfpPath = "./tasks/Images/Profile Images/MikeJohnson.png";
        MikeJohnsonPfpPath = await copyFileToUploads(MikeJohnsonPfpPath);
        MikeJohnsonPfpPath = path.resolve(MikeJohnsonPfpPath);
        await uploadPfP("MikeJohnson", MikeJohnsonPfpPath);

        let RobertSmithPfpPath = "./tasks/Images/Profile Images/RobertSmith.png";
        RobertSmithPfpPath = await copyFileToUploads(RobertSmithPfpPath);
        RobertSmithPfpPath = path.resolve(RobertSmithPfpPath);
        await uploadPfP("RobertSmith", RobertSmithPfpPath);
        
        let SarahWilsonPfpPath = "./tasks/Images/Profile Images/SarahWilson.png";
        SarahWilsonPfpPath = await copyFileToUploads(SarahWilsonPfpPath);
        SarahWilsonPfpPath = path.resolve(SarahWilsonPfpPath);
        await uploadPfP("SarahWilson", SarahWilsonPfpPath);

        console.log('Done adding Profile Pictures!');

        console.log('Done seeding the database!');
  } catch (error) {
    console.error('Error Seeding Data:', error);
  } 

  await closeConnection();
};

main();