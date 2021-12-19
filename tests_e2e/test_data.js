const mongoDb = require("mongodb");
const dotenv = require("dotenv");
const fs = require('fs');

function initEnv() {
  const options = {
    local: process.env.ENV === undefined || process.env.ENV === 'LOCAL',
    test: process.env.ENV === 'TEST',
    beta: process.env.ENV === 'BETA',
    prod: process.env.ENV === 'PROD',
  };

  if (options.prod) {
    /**
     * The production environment using the production firebase
     * configuration and the production mongodb database
     */
    dotenv.config({ path: '.env.prod' });

    process.env.ENV = 'PROD';
  } else if (options.beta) {
    /**
     * The beta environment using the beta firebase configuration
     * and the beta mongodb database
     */
    dotenv.config({ path: '.env.beta' });
    process.env.ENV = 'BETA';
  } else if (options.test) {
    /**
     * The local environment using the local firebase emulation and
     * the local mongodb database for test
     */
    dotenv.config({ path: '.env.test' });
    process.env.ENV = 'TEST';
  } else {
    /**
     * The local environment using the local firebase emulation and
     * the local mongodb database
     */
    dotenv.config({ path: '.env' });
    process.env.ENV = 'LOCAL';
  }
}

const localUsersFile = () => {
  const env = process.env.ENV;
  if (env !== 'LOCAL' && env !== 'TEST')
    if (env !== 'PROD' && env !== 'BETA')
      throw Error('Wrong usage of offline firebase auth');
  if (env === 'LOCAL') return './.localAuth.json';
  else return './.localAuth.test.json';
};

const resetAuthData = async (
) => {
  try {
    fs.writeFileSync(localUsersFile(), JSON.stringify([]), {
      encoding: 'utf8',
    });

    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e };
  }
};

initEnv();

const client = new mongoDb.MongoClient(process.env.MONGODB_URL, {
  ignoreUndefined: true,
});

client.connect().then(() => {});

client
  .db()
  .dropDatabase()
  .then(() => {});

console.log('dropped database');

resetAuthData().then(() => {});

console.log('dropped auth data');

process.exit();