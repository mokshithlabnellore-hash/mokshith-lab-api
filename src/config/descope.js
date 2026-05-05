let DescopeClient = require('@descope/node-sdk');
if (DescopeClient.default) {
  DescopeClient = DescopeClient.default;
}
require('dotenv').config();

const descopeClient = DescopeClient({
  projectId: process.env.DESCOPE_PROJECT_ID,
  managementKey: process.env.DESCOPE_MANAGEMENT_KEY,
});

module.exports = descopeClient;
