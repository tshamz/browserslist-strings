const Facade = require('../../lib/facade')
const siteSchema = require('./schema')

class SiteFacade extends Facade {
  insertMany (entries) {
    return this.Model
      .insertMany(entries);
  }

  clear () {
    return this.Model
      .remove({});
  }
}

module.exports = new SiteFacade('Site', siteSchema)
