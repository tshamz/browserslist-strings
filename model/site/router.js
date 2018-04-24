const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.find(...args));

router.route('/update')
  .get((...args) => {
    return controller.updateSites(...args)
  });

router.route('/:url')
  .get((...args) => {
    return controller.findOne(...args)
  });

router.route('/browserslist/:url')
  .get((...args) => {
    return controller.browsersList(...args)
  });

module.exports = router;
