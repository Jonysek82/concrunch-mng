const mongoose = require('mongoose');
const connect = async (uri) => {
  await mongoose.connect(uri);
  console.log('Festival service connected to MongoDB');
};

module.exports = { connect };
