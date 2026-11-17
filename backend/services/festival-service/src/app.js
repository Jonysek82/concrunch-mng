const express = require('express');
const eventRoutes = require('./routes/events');
const performerRoutes = require('./routes/performers');
const merchantRoutes = require('./routes/merchants');
const newsRoutes = require('./routes/news');
const tagRoutes = require('./routes/tags');
const adminRoutes = require('./routes/admin');
const errorMiddleware = require('./middleware/errorMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');

const createApp = () => {
  const app = express();
  app.use(express.json());

  app.use('/api/events', eventRoutes);
  app.use('/api/performers', performerRoutes);
  app.use('/api/merchants', merchantRoutes);
  app.use('/api/news', newsRoutes);
  app.use('/api/tags', tagRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
};

module.exports = createApp;
