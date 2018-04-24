// require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const config = require('./config');
const routes = require('./routes');
// const analytics = require('./analytics');

const app = express();

mongoose.connect(config.mongo.url);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.use('/', routes);

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`);
  console.log(config.MONGODB_URI);
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  // const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  // const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
  // const project = process.env.GOOGLE_PROJECT_ID;
  // console.log(email);
  // console.log(privateKey);
  // console.log(project);
});

module.exports = app;
