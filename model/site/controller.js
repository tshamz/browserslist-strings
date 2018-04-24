const Controller = require('../../lib/controller')
const siteFacade = require('./facade')

const browserLookup = {
  'Android Webview': 'Android',
  'Safari (in-app)': 'iOS'
};

const normalizeUrl = url => {
  return decodeURIComponent(url)
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '');
};

const generateBrowsersList = browsers => {


};

class SiteController extends Controller {

  findOne (req, res, next) {
    const url = normalizeUrl(req.params.url);
    return this.facade.findOne({ propertyUrl: url })
      .then(doc => res.status(200).json(doc))
      .catch(err => next(err))
  }

  async browsersList (req, res, next) {
    const url = normalizeUrl(req.params.url);
    const site = await this.facade.findOne({ propertyUrl: url }).catch(err => next(err));
    const browsersListString = generateBrowsersList(site.browsers);

    console.log(browsersListString);

    return res.status(200).json(site)
  }

}

module.exports = new SiteController(siteFacade)
