const mongoose = require('mongoose');

const connect = (uri) => mongoose.connect(uri).then(() => {
  console.log('Identity service connected to MongoDB');
});

module.exports = { connect };
