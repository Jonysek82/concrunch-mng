const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const internalAuthRoutes = require('./routes/internalAuth');
const errorMiddleware = require('./middleware/errorMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/internal/auth', internalAuthRoutes);
  app.get('/health', (req, res) => res.json({ ok: true, service: 'identity' }));
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
};

module.exports = createApp;
