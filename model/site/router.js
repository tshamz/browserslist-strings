const controller = require('./controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.find(...args))

router.route('/:url')
  .get((...args) => {
    return controller.findOne(...args)
  })

router.route('/browserslist/:url')
  .get((...args) => {
    return controller.browsersList(...args)
  })

// router.route('/:id')
//   .get((...args) => {
//     return controller.findById(...args)
//   })

module.exports = router;
