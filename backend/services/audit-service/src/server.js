require('dotenv').config();
const mongoose = require('mongoose');
const createApp = require('./app');
const { getServiceToken } = require('../../../shared/serviceToken');

const port = process.env.AUDIT_PORT || 5003;
const mongoUri = process.env.AUDIT_MONGODB_URI || 'mongodb://127.0.0.1:27017/concrunch_audit';

getServiceToken();

mongoose.connect(mongoUri).then(() => {
  console.log('Audit service connected to MongoDB');
  createApp().listen(port, () => console.log(`Audit service listening on port ${port}`));
}).catch((err) => {
  console.error('Audit service failed to start', err);
  process.exitCode = 1;
});
