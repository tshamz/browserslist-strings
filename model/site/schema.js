const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const browser = {
  browser: String,
  version: String,
  marketShare: Number
};

const site = {
  profileId: Number,
  propertyId: Number,
  propertyName: String,
  propertyUrl: String,
  accountId: Number,
  accountName: String,
  browsers: [browser]
};

const siteSchema = new Schema(site);

module.exports = siteSchema
