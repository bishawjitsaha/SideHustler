import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
    credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProvider: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universeDomain:process.env.FIREBASE_UNIVERSE_DOMAIN
    }),
};


export const firebase = admin.apps.length
  ? admin.app()
  : admin.initializeApp(serviceAccount);