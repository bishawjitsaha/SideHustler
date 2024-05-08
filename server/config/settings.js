import dotenv from 'dotenv';
dotenv.config();

export const mongoConfig = {
//   serverUrl: process.env.MONGO_URL,
  serverUrl: "mongodb://127.0.0.1:27017/",
  database: "SideHustlerDB",
};
