const mongoDb = require("mongodb");
const dotenv = require("dotenv");

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

process.exit();