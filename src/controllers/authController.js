const descopeClient = require('../config/descope');
const { db, auth } = require('../config/firebase');

// Customer Login via Descope Session Token
// Frontend sends the session token after OTP success
exports.customerLogin = async (req, res) => {
  const sessionToken = req.headers.authorization?.split(' ')[1];

  if (!sessionToken) {
    return res.status(401).json({ message: 'No session token provided' });
  }

  try {
    const authInfo = await descopeClient.validateSession(sessionToken);
    const mobileNumber = authInfo.token.phone; // Assuming phone is in the token

    if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number not found in session' });
    }

    // Check if customer exists in Firestore
    const customerRef = db.collection('customers').doc(mobileNumber);
    const doc = await customerRef.get();

    if (!doc.exists) {
      // Create new customer record with default values
      const newCustomer = {
        mobileNumber,
        firstName: '',
        lastName: '',
        address: '',
        createdAt: new Date().toISOString(),
      };
      await customerRef.set(newCustomer);
      return res.status(201).json({ message: 'Customer created', customer: newCustomer });
    }

    res.status(200).json({ message: 'Login successful', customer: doc.data() });
  } catch (error) {
    console.error('Descope validation error:', error);
    res.status(401).json({ message: 'Invalid session', error: error.message });
  }
};

const axios = require('axios');

// Admin Login (Email/Password via Firebase Auth REST API)
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body; // Treat username as email
  const apiKey = process.env.FIREBASE_API_KEY;

  if (!apiKey || apiKey === 'your-firebase-web-api-key') {
    return res.status(500).json({ message: 'Firebase API Key not configured in .env' });
  }

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email: username,
        password: password,
        returnSecureToken: true,
      }
    );

    const { idToken, localId } = response.data;

    // Optional: You can check if this user has "admin" role in Firestore here
    // const adminDoc = await db.collection('admins').doc(localId).get();
    // if (!adminDoc.exists) return res.status(403).json({ message: 'Not an admin' });

    res.status(200).json({ 
      message: 'Admin login successful', 
      token: idToken,
      uid: localId
    });
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || 'Authentication failed';
    res.status(401).json({ message: errorMessage });
  }
};
