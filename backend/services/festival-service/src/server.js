require('dotenv').config();
const createApp = require('./app');
const { connect } = require('./config/database');
const { getServiceToken } = require('../../../shared/serviceToken');

const PORT = process.env.FESTIVAL_PORT || 5002;
const MONGODB_URI = process.env.FESTIVAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/concrunch_festival';

const app = createApp();

getServiceToken();

connect(MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(err => {
  console.error('Failed to start', err);
  process.exitCode = 1;
});
