import { firebase } from './firebase/serverconfig.js';

const verifyToken = async (req, res, next) => {
  console.log('Verifying token');
  console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    console.log('Token received: ', token);
    try {
      const decodedToken = await firebase.auth().verifyIdToken(token);
      req.uid = decodedToken.uid;
      req.email =decodedToken.email;
      next();
    } catch (error) {
      console.log(error);
      res.status(403).send('Unauthorized');
    }
  };
  
  export default verifyToken;
