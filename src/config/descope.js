const DescopeClient = require('@descope/node-sdk').default;
require('dotenv').config();

const descopeClient = DescopeClient({
  projectId: process.env.DESCOPE_PROJECT_ID,
  managementKey: process.env.DESCOPE_MANAGEMENT_KEY,
});

module.exports = descopeClient;
