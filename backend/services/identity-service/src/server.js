require('dotenv').config();
const createApp = require('./app');
const { connect } = require('./config/database');
const { getServiceToken } = require('../../../shared/serviceToken');
const { getJwtSecret } = require('../../../shared/jwtSecret');

const port = process.env.IDENTITY_PORT || 5001;
const mongoUri = process.env.IDENTITY_MONGODB_URI || 'mongodb://127.0.0.1:27017/concrunch_identity';
const app = createApp();

getServiceToken();
getJwtSecret();

connect(mongoUri).then(() => {
  app.listen(port, () => console.log(`Identity service listening on port ${port}`));
}).catch((err) => {
  console.error('Identity service failed to start', err);
  process.exitCode = 1;
});
