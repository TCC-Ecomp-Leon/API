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
      ADM_PASSWORD: string;
    }
  | {
      ENV: 'LOCAL' | 'TEST';
      JWT_SECRET: string;
      MONGODB_URL: string;
      ADM_PASSWORD: string;
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
      ADM_PASSWORD: string | undefined;
    }
  | {
      ENV: 'LOCAL' | 'TEST' | undefined;
      JWT_SECRET: string | undefined;
      MONGODB_URL: string | undefined;
      ADM_PASSWORD: string | undefined;
    };

export default function (): EnvirontmentVariables {
  if (!_initEnv) {
    initEnv();
    _initEnv = true;
  }
  let envVariables: _EnvirontmentVariables;
  if (process.env.ENV === 'LOCAL' || process.env.ENV === 'TEST') {
    envVariables = {
      ENV: process.env.ENV,
      JWT_SECRET: process.env.JWT_SECRET,
      MONGODB_URL: process.env.MONGODB_URL,
      ADM_PASSWORD: process.env.ADM_PASSWORD,
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
      ADM_PASSWORD: process.env.ADM_PASSWORD,
    };
  }

  Object.keys(envVariables).forEach((key) => {
    if ((envVariables as any)[key] === undefined) {
      throw Error('Not found ' + key + ' environment variable');
    }
  });

  return envVariables as EnvirontmentVariables;
}

function initEnv(): void {
  dotenv.config({ path: '.env' });
}
