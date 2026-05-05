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

// Admin Login (Username/Password)
// Note: Firebase Auth usually uses Email/Password. 
// If "username" is used, we might need a lookup or just use email as username.
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Simple implementation using .env for now, 
  // or you can implement Firebase Auth verification here.
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ 
      message: 'Admin login successful', 
      token: 'mock-admin-token' // In a real app, generate a JWT or use Firebase custom tokens
    });
  }

  res.status(401).json({ message: 'Invalid admin credentials' });
};
