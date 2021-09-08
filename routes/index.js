
const authRouter = require('./auth');
const usersRouter = require('./users');
const topicRouter = require('./topic');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.render('index', { title: 'Assignment' });
  });
  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/topic', topicRouter);
};

