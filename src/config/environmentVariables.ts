import dotenv from 'dotenv';

let _initEnv: boolean = false;

type EnvirontmentVariables =
  | {
      ENV: 'PROD' | 'BETA';
      MONGODB_URL: string;
      FIREBASE_API_KEY: string;
      FIREBASE_AUTH_DOMAIN: string;
      FIREBASE_DATABASE_URL: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_STORAGE_BUCKET: string;
      FIREBASE_MESSAGING_SENDER_ID: string;
      FIREBASE_APP_ID: string;
      FIREBASE_MEASUREMENT_ID: string;
    }
  | {
      ENV: 'LOCAL';
      JWT_SECRET: string;
      MONGODB_URL: string;
    };

type _EnvirontmentVariables =
  | {
      ENV: 'PROD' | 'BETA' | undefined;
      MONGODB_URL: string | undefined;
      FIREBASE_API_KEY: string | undefined;
      FIREBASE_AUTH_DOMAIN: string | undefined;
      FIREBASE_DATABASE_URL: string | undefined;
      FIREBASE_PROJECT_ID: string | undefined;
      FIREBASE_STORAGE_BUCKET: string | undefined;
      FIREBASE_MESSAGING_SENDER_ID: string | undefined;
      FIREBASE_APP_ID: string | undefined;
      FIREBASE_MEASUREMENT_ID: string | undefined;
    }
  | {
      ENV: 'LOCAL' | undefined;
      JWT_SECRET: string | undefined;
      MONGODB_URL: string | undefined;
    };

export default function (): EnvirontmentVariables {
  if (!_initEnv) {
    initEnv();
    _initEnv = true;
  }
  let envVariables: _EnvirontmentVariables;
  if (process.env.ENV === 'LOCAL') {
    envVariables = {
      ENV: process.env.ENV,
      JWT_SECRET: process.env.JWT_SECRET,
      MONGODB_URL: process.env.MONGODB_URL,
    };
  } else {
    envVariables = {
      ENV:
        process.env.ENV == 'PROD' || process.env.ENV == 'BETA'
          ? process.env.ENV
          : undefined,
      MONGODB_URL: process.env.MONGODB_URL,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    };
  }

  Object.keys(envVariables).forEach((key) => {
    if ((envVariables as any)[key] === undefined) {
      throw Error('Not found ' + key + ' environment variable');
    }
  });

  return envVariables as EnvirontmentVariables;
}

/**
 * Function to select what environment we will, the local, beta or prod env.
 */
function initEnv(): void {
  const options = {
    local: process.env.ENV === undefined || process.env.ENV === 'LOCAL',
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
  } else {
    /**
     * The local environment using the local firebase emulation and
     * the local mongodb database
     */
    dotenv.config({ path: '.env' });
    process.env.ENV = 'LOCAL';
  }
}
