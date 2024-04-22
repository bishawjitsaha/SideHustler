import { firebase } from './firebase/serverconfig.js';

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log('Token received: ', token);
    try {
      console.log(typeof token);
      const decodedToken = await firebase.auth().verifyIdToken(token);
      req.uid = decodedToken;
      next();
    } catch (error) {
      console.log(error);
      res.status(403).send('Unauthorized');
    }
  };
  
  export default verifyToken;