const Controller = require('../../lib/controller')
const siteFacade = require('./facade')

class SiteController extends Controller {}

module.exports = new SiteController(siteFacade)
