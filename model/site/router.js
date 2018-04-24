const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.find(...args))

router.route('/:id')
  .get((...args) => controller.findById(...args))

module.exports = router;
