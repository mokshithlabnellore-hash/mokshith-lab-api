const admin = require('firebase-admin');
require('dotenv').config();

let serviceAccount;

try {
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.length > 50) {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/["']/g, '').trim(),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
  } else {
    serviceAccount = require('./firebase-service-account.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error('Firebase Initialization Error:', error.message);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
