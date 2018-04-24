const fetch = require('node-fetch');
const { google } = require('googleapis');

const siteFacade = require('./model/site/facade');

const analytics = google.analytics('v3');
const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
const quotaUser = 'browserslist-string';

const setAuth = async (email, key, project) => {
  // const auth = await google.auth.getClient({ scopes });
  // const project = await google.auth.getDefaultProjectId();
  // auth.subject = 'analytics2@bvaccel.com';
  // google.options({ auth, project, quotaUser });

  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  // const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const project = process.env.GOOGLE_PROJECT_ID;

  console.log(email);
  console.log(privateKey);
  console.log(project);

  // const auth = new google.auth.JWT(email, null, key, scopes);
  // auth.subject = 'analytics2@bvaccel.com';
  // google.options({ auth, project, quotaUser });
};

const propertyHasStarredProfile = property => {
  return property.profiles.some(profile => profile.starred)
};

const accountHasStarredProfile = account => {
  return account.webProperties.some(property => propertyHasStarredProfile(property))
};

const createSiteObject = (profile, property, account) => {
  return {
    profile: {
      id: profile.id
    },
    property: {
      id: property.internalWebPropertyId,
      name: property.name,
      url: property.websiteUrl
    },
    account: {
      id: account.id,
      name: account.name
    }
  };
};

const getProfileIds = (profiles, property, account) => {
  return profiles.reduce((ids, profile) => {
    if (profile.starred) {
      const entry = createSiteObject(profile, property, account);
      return [ ...ids, entry ];
    } else {
      return [ ...ids ];
    }
  }, []);
};

const getPropertyIds = (properties, account) => {
  return properties.reduce((ids, property) => {
    if (property.profiles) {
      const entry = getProfileIds(property.profiles, property, account);
      return [ ...ids, ...entry ];
    } else {
      return [ ...ids ];
    }
  }, []);
};

const getRequestData = async () => {
  const { data: { items: accounts }} = await analytics.management.accountSummaries.list();
  return accounts.reduce((ids, account) => {
    return [ ...ids,  ...getPropertyIds(account.webProperties, account) ];
  }, []);
};

const createRequestParams = request => {
  return {
    'ids': `ga:${request.profile.id}`,
    'start-date': '30daysAgo',
    'end-date': 'yesterday',
    'metrics': 'ga:sessions',
    'dimensions': 'ga:browser,ga:browserVersion',
    'sort': '-ga:sessions',
    'max-results': '50'
  };
};

const filterBrowsers = (browsers, threshold, total) => {
  return browsers.reduce((filteredBrowsers, browserData) => {
    const [ browser, version, count ] = browserData;
    const marketShare = parseInt(count) / parseInt(total);
    if (marketShare > threshold) {
      return [ ...filteredBrowsers, { browser, version, marketShare }];
    } else {
      return [ ...filteredBrowsers ];
    }
  }, []);
};

const flattenRequest = request => {
  const { profile, property, account } = request;
  return {
    profileId: profile.id,
    propertyId: property.id,
    propertyName: property.name,
    propertyUrl: property.url,
    accountId: account.id,
    accountName: account.name
  }
};

const sendRequest = (request, wait = 0) => {
  return new Promise((resolve, reject) => {
    const params = createRequestParams(request);
    setTimeout(() => {
      analytics.data.ga.get(params)
        .then(res => {
          const { data: { rows: browsers, totalsForAllResults: { 'ga:sessions': total }}} = res;
          const filteredBrowsers = (browsers) ? filterBrowsers(browsers, 0.025, total) : [];
          const flattenedRequest = flattenRequest(request);
          resolve({ ...flattenedRequest, browsers: filteredBrowsers });
        })
        .catch(err => {
          const newWait = (wait === 0) ? 1 : wait * 2;
          resolve(sendRequest(request, newWait));
        });
    }, wait * 1000);
  });
};

const sendRequests = requests => {
  const promises = requests.map(request => sendRequest(request));
  return Promise.all(promises);
};

const get = async () => {
  return await siteFacade.find();
};

const update = async () => {
  await setAuth();
  const requests = await getRequestData();
  const entries = await sendRequests(requests);
  await clear();
  return await siteFacade.insertMany(entries);
};

const clear = async () => {
  return await siteFacade.clear();
};

module.exports = { get, update, clear, setAuth };
