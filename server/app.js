// import express from "express";
// import routes from "./routes/index.js";
// const app = express();

// app.use(express.json());
// routes(app);

// app.listen(3000, () => {
//     console.log("Your routes will be running on http://localhost:3000");
// });

import * as posts from "./data/posts.js";
import * as users from "./data/users.js";
import { dbConnection, closeConnection } from "./config/mongoConnection.js";

const db = await dbConnection();

try{
    
    let testPost = await posts.createPost("Test Post", "This is a test post", {dateStart: "12/12/2021", dateEnd: "12/12/2021", timeStart: "12:00 PM", timeEnd: "1:00 PM"}, 100, "61f7b3b3b3b3b3b3b3b3b3b3", [], "remote");
    // let xx = await events.getAll();
    console.log(testPost);
}catch(e){
    console.log(e);
}

await closeConnection();