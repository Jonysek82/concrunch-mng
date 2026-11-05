const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const performerRoutes = require('./routes/performers');
const merchantRoutes = require('./routes/merchants');
const newsRoutes = require('./routes/news');
const tagRoutes = require('./routes/tags');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const errorMiddleware = require('./middleware/errorMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/performers', performerRoutes);
  app.use('/api/merchants', merchantRoutes);
  app.use('/api/news', newsRoutes);
  app.use('/api/tags', tagRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
};

module.exports = createApp;
