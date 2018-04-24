const Controller = require('../../lib/controller');
const siteFacade = require('./facade');
const analytics = require('../../analytics');

const normalizeUrl = url => {
  return decodeURIComponent(url)
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '');
};

const mobileBrowserLookup = {
  'Android Webview': 'Android',
  'Safari': 'iOS',
  'Safari (in-app)': 'iOS',
  'Samsung Internet': 'Samsung',
  'Chrome': 'ChromeAndroid'
};

const desktopBrowserLookup = {
  'Internet Explorer': 'Explorer'
};

const generateBrowsersList = browsers => {
  return browsers.map(browser => {
    const browserLookup = (['mobile', 'tablet'].includes(browser.device)) ? mobileBrowserLookup : desktopBrowserLookup;
    const browserName = browserLookup[browser.browser] || browser.browser;
    const browserVersion = browser.browserVersion
      .split('.')
      .splice(0,2)
      .join('.')
      .replace('(not set)', 'last 2 iOS versions');
    return `${browserName} ${browserVersion}`;
  });
};

class SiteController extends Controller {

  findOne (req, res, next) {
    const url = normalizeUrl(req.params.url);
    return this.facade.findOne({ propertyUrl: url })
      .then(doc => res.status(200).json(doc))
      .catch(err => next(err))
  }

  async browsersList (req, res, next) {
    try {
      const url = normalizeUrl(req.params.url);
      const site = await this.facade.findOne({ propertyUrl: url });
      const supportedBrowsers = generateBrowsersList(site.browsers);
      return res.status(200).json({ url, supportedBrowsers });
    } catch (err) {
      const message = 'error!';
      return res.status(200).json({ message, supportedBrowsers: [ '> 2.5% in US' ] });
    }
  }

  async updateSites (req, res, next) {
    try {
      const sites = await analytics.update();
      return res.status(200).json({ sites });
    } catch (err) {
      return res.status(200).json({ error: 'something went wrong', message: err });
    }
  }

}

module.exports = new SiteController(siteFacade)
