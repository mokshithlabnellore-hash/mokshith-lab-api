const { db } = require('../config/firebase');

// Fetch all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const snapshot = await db.collection('customers').get();
    const customers = [];
    snapshot.forEach(doc => {
      customers.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

// Fetch specific customer by ID (Mobile Number)
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await db.collection('customers').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error: error.message });
  }
};

// Update customer details
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, address } = req.body;

  try {
    const customerRef = db.collection('customers').doc(id);
    const doc = await customerRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customerRef.update({
      firstName,
      lastName,
      address,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Customer updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('customers').doc(id).delete();
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error.message });
  }
};
