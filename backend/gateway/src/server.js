require('dotenv').config();
const { createApp } = require('./app');

const port = process.env.GATEWAY_PORT || process.env.PORT || 5000;
createApp().listen(port, () => console.log(`API Gateway listening on port ${port}`));
