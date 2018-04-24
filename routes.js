const Router = require('express').Router;
const router = new Router();

const site = require('./model/site/router');

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to im-just-browsing API!' });
})

router.use('/site', site);

module.exports = router;
