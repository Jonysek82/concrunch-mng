require('dotenv').config();
const createApp = require('./app');
const { connect } = require('./config/database');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/concrunch_manager';

const app = createApp();

connect(MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(err => {
  console.error('Failed to start', err);
});
