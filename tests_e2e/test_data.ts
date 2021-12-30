import { MongoClient } from 'mongodb';
import fs from 'fs';
import environmentVariables from '../src/config/environmentVariables';

const localUsersFile = () => {
  const env = environmentVariables().ENV;
  if (env !== 'LOCAL' && env !== 'TEST')
    if (env !== 'PROD' && env !== 'BETA')
      throw Error('Wrong usage of offline firebase auth');
  if (env === 'LOCAL') return './.localAuth.json';
  else return './.localAuth.test.json';
};

const resetAuthData = async () => {
  try {
    fs.writeFileSync(localUsersFile(), JSON.stringify([]), {
      encoding: 'utf8',
    });

    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e };
  }
};

const resetDatabase = async () => {
  const client = new MongoClient(environmentVariables().MONGODB_URL, {
    ignoreUndefined: true,
  });
  const connectedClient = await client.connect();

  await connectedClient.db().dropDatabase({
    writeConcern: {
      w: 'majority',
    },
  });
};

resetAuthData().then(() => {
  console.log('dropped auth data');
  resetDatabase().then(() => {
    console.log('dropped database');
    process.exit();
  });
});
