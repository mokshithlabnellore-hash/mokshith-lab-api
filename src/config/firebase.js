const admin = require('firebase-admin');
require('dotenv').config();

let serviceAccount;

try {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    // If running on Vercel or environment variables are set
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/["']/g, '').trim(),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
  } else {
    // Fallback to local JSON for local development
    serviceAccount = require('./firebase-service-account.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Firebase Initialization Error:', error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
