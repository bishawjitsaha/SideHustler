import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import * as userData from '../data/users.js';
import * as postData from '../data/posts.js';
import { firebase } from "../firebase/serverconfig.js";

const auth = firebase.auth();

let userRecord1;
let userRecord2;
let userRecord3;
let userRecord4;

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
    // try {
    //     userRecord1 = await auth.createUser({
    //         email: "johndoe@gmail.com",
    //         password: "j0hnsPa$$word",
    //         displayName: "JohnDoe",
    //     });
    //     console.log("Created user:", userRecord1.uid);

    //     userRecord2 = await auth.createUser({
    //         email: "janesmith@hotmail.com",
    //         password: "j4n3sPa$$word",
    //         displayName: "JaneSmith",
    //     });
    //     console.log("Created user2:", userRecord2.uid);

    //     userRecord3 = await auth.createUser({
    //         email: "mikejohnson@yahoo.com",
    //         password: "m1k3sPa$$word",
    //         displayName: "MikeJohnson",
    //     });
    //     console.log("Created user3:", userRecord3.uid);

    //     userRecord4 = await auth.createUser({
    //         email: "sarahwilson@example.com",
    //         password: "s4r4hsPa$$word",
    //         displayName: "SarahWilson",
    //     });
    //     console.log("Created user4:", userRecord4.uid);
    // } catch (e) {
    //     console.error("Error creating user: ", e);
    // }
}

const main = async () => {
    try {
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
                degree: "Bachelor's",
                major: "Computer Science",
                gradYear: "2012",
            },
            experience: [
                {
                    company: "Tech Inc.",
                    position: "Senior Software Engineer",
                    startDate: "06/01/2012",
                    endDate: "03/31/2022",
                },
            ],
            skills: [
                {
                    name: "JavaScript",
                    description: "Proficient in modern JavaScript development",
                },
                {
                    name: "Node.js",
                    description:
                        "Experienced in building server-side applications with Node.js",
                },
            ],
            rating: {
                average: 4.8,
                total: 35,
            },
            reservedTime: [
                {
                    dateStart: "04/10/2023",
                    timeStart: "10:00",
                    timeEnd: "15:00",
                    dateEnd: "04/10/2023",
                },
                {
                    dateStart: "05/01/2023",
                    timeStart: "14:00",
                    timeEnd: "18:00",
                    dateEnd: "05/01/2023",
                },
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

        // Update user 2 with additional fields
        await userData.updateUserById(user2._id, {
            pfp: "https://example.com/janesmith-profile.jpg",
            bio: "I'm a graphic designer with 5 years of experience.",
            education: {
                school: "Art Institute of Example",
                degree: "Bachelor's",
                major: "Graphic Design",
                gradYear: "2017",
            },
            experience: [
                {
                    company: "Design Studio LLC",
                    position: "Graphic Designer",
                    startDate: "09/01/2017",
                    endDate: "04/30/2022",
                },
            ],
            skills: [
                {
                    name: "Adobe Creative Cloud",
                    description:
                        "Proficient in Photoshop, Illustrator, and InDesign",
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
                {
                    dateStart: "04/15/2023",
                    timeStart: "11:00",
                    timeEnd: "16:00",
                    dateEnd: "04/15/2023",
                },
                {
                    dateStart: "05/05/2023",
                    timeStart: "09:00",
                    timeEnd: "14:00",
                    dateEnd: "05/05/2023",
                },
            ],
        });

        // Create user 3
        const user3 = await userData.createUser(
            userRecord3.uid,
            "MikeJohnson",
            "Mike",
            "Johnson",
            "mikejohnson@yahoo.com",
            41,
            false
        );

        // Update user 3 with additional fields
        await userData.updateUserById(user3._id, {
            pfp: "https://example.com/mikejohnson-profile.jpg",
            bio: "I'm a marketing manager with 15 years of experience.",
            education: {
                school: "State University",
                degree: "Master's",
                major: "Marketing",
                gradYear: "2008",
            },
            experience: [
                {
                    company: "Marketing Solutions Inc.",
                    position: "Marketing Manager",
                    startDate: "06/01/2008",
                    endDate: "03/31/2023",
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
                {
                    dateStart: "04/20/2023",
                    timeStart: "13:00",
                    timeEnd: "17:00",
                    dateEnd: "04/20/2023",
                },
                {
                    dateStart: "05/10/2023",
                    timeStart: "08:00",
                    timeEnd: "12:00",
                    dateEnd: "05/10/2023",
                },
            ],
        });

        // Create user 4
        
        const user4 = await userData.createUser(
            userRecord4.uid,
            "SarahWilson",
            "Sarah",
            "Wilson",
            "sarahwilson@example.com",
            25,
            false
        );

        // Update user 4 with additional fields
        await userData.updateUserById(user4._id, {
            pfp: "https://example.com/sarahwilson-profile.jpg",
            bio: "I'm a marketing intern with a passion for social media marketing.",
            education: {
                school: "State College",
                degree: "Bachelor's",
                major: "Marketing",
                gradYear: "2020",
            },
            experience: [
                {
                    company: "Social Media Agency",
                    position: "Marketing Intern",
                    startDate: "06/01/2020",
                    endDate: "08/31/2021",
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
                {
                    dateStart: "04/25/2021",
                    timeStart: "09:00",
                    timeEnd: "13:00",
                    dateEnd: "04/25/2023",
                },
                {
                    dateStart: "05/15/2023",
                    timeStart: "14:00",
                    timeEnd: "18:00",
                    dateEnd: "05/15/2023",
                },
            ],
        });
    console.log('Dummy users created successfully!');

    // Create dummy posts for tasks or jobs
    const taskTime1 = { dateStart: '06/25/2024', dateEnd: '06/26/2024', timeStart: '17:00', timeEnd: '10:00' };
    const post1 = await postData.createPost(
        "Need a babysitter for the weekend",
        "Looking for a responsible babysitter to watch my two children (ages 5 and 8) for the weekend. Job includes preparing meals, supervising playtime, and ensuring their safety.",
        taskTime1,
        100,
        user1._id,
        [], // Empty array for photos
        "in-person",
        ["Indoors", "Childcare"]
    );

    const taskTime2 = { dateStart: '05/01/2024', dateEnd: '06/30/2024', timeStart: '08:00', timeEnd: '18:00' };
    const post2 = await postData.createPost(
        "Website development needed",
        "Looking for a skilled web developer to create a website for my small business. The website should be responsive, user-friendly, and include an online store.",
        taskTime2,
        2500,
        user2._id,
        [], // Empty array for photos
        "remote",
        ["Design", "IT Support"]
    );

    const taskTime3 = { dateStart: '08/20/2024', dateEnd: '08/20/2024', timeStart: '14:00', timeEnd: '17:00' };
    const post3 = await postData.createPost(
        "Furniture assembly required",
        "Need someone to assemble a new dining table and chairs that I recently purchased. Must have experience with furniture assembly and necessary tools.",
        taskTime3,
        75,
        user3._id,
        [], // Empty array for photos
        "in-person",
        ["Assembly", "Indoors", "Handywork"]
    );

    const taskTime4 = { dateStart: '05/10/2024', dateEnd: '06/15/2024', timeStart: '16:00', timeEnd: '18:00' };
    const post4 = await postData.createPost(
        "Seeking a math tutor for high school student",
        "Looking for a math tutor to help my high school student prepare for upcoming exams. Tutoring sessions should cover algebra, geometry, and trigonometry.",
        taskTime4,
        30,
        user4._id,
        [], // Empty array for photos
        "remote",
        ["Tutoring"]
    );
    console.log('Dummy posts created successfully!');

    // Test getUserById
    const userById = await userData.getUserById(user1._id);
    console.log('User by ID:', userById);

    // Test updateRating
    const updatedRating = await userData.updateRating(user1._id, 4.5);
    console.log('Updated rating:', updatedRating);

    // Test updateReservedTime
    const reservedTime = [
      {
        dateStart: '04/15/2024',
        timeStart: '9:00',
        timeEnd: '11:00',
        dateEnd: '04/15/2024',
      },
    ];
    const updatedReservedTime = await userData.updateReservedTime(user1._id, reservedTime);
    console.log('Updated reserved time:', updatedReservedTime);

    // Test userData.updateUserById
    const updatedUser = await userData.updateUserById(user1._id, { bio: 'This is my new bio.' });
    console.log('Updated Bio:', updatedUser);

    // Test getPostById
    const postById = await postData.getPostById(post1._id);
    console.log('Post by ID:', postById);

    // Test updatePostById
    const updatedPostData = {
      title: 'Updated Task Title',
      description: 'Updated Task description',
    };
    const updatedPost = await postData.updatePostById(post1._id, updatedPostData);
    console.log('Updated post Title and Description:', updatedPost);

    // Test updatePostStatus
    const updatedPostStatus = await postData.updatePostStatus(post1._id, 'in progress');
    console.log('Updated post status:', updatedPostStatus);

    // Test addApplicant
    const applicantId = user2._id;
    const postWithApplicant = await postData.addApplicant(post1._id, applicantId);
    console.log('Post with applicant:', postWithApplicant);

    // Test removeApplicant
    const postWithoutApplicant = await postData.removeApplicant(post1._id, applicantId);
    console.log('Post without applicant:', postWithoutApplicant);

    // Test deletePostById
    const deletedPost = await postData.deletePostById(post1._id, user1._id);
    console.log('Deleted post:', deletedPost);

    console.log('Done seeding the database!');
  } catch (error) {
    console.error('Error creating dummy users or posts:', error);
  }

  await closeConnection();
};

main();