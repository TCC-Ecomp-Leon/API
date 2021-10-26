import firebase from 'firebase';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { DatabaseResult } from '../../../structure/databaseResult';
import environmentVariables from '../../../config/environmentVariables';

let db: admin.database.Database | undefined = undefined;
let auth: firebase.auth.Auth | undefined = undefined;
let adminAuth: admin.auth.Auth | undefined = undefined;

const getFirebaseReference = (): {
  db: admin.database.Database;
  auth: firebase.auth.Auth;
  adminAuth: admin.auth.Auth;
} => {
  if (db === undefined || auth === undefined || adminAuth === undefined) {
    const env = environmentVariables();

    if (env.ENV === 'LOCAL') throw Error('Wrong usage of online firebase auth');

    const serviceAccount =
      env.ENV === 'PROD'
        ? require('../../../../prod.firebaseServiceAccount.json')
        : require('../../../../beta.firebaseServiceAccount.json');

    const firebaseConfig = {
      apiKey: env.FIREBASE_API_KEY,
      authDomain: env.FIREBASE_AUTH_DOMAIN,
      databaseURL: env.FIREBASE_DATABASE_URL,
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
      appId: env.FIREBASE_APP_ID,
      measurementId: env.FIREBASE_MEASUREMENT_ID,
    };

    const firebaseAdminConfig = {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: env.FIREBASE_DATABASE_URL,
    };

    firebase.initializeApp(firebaseConfig);
    admin.initializeApp(firebaseAdminConfig);

    db = admin.database();
    auth = firebase.auth();
    adminAuth = admin.auth();
  }
  return { db: db, auth: auth, adminAuth: adminAuth };
};

const createAuthAccount = async (
  email: string,
  password: string
): Promise<DatabaseResult<{ token: string; userId: string }>> => {
  const { auth, adminAuth } = getFirebaseReference();
  try {
    const authResponse = await auth.createUserWithEmailAndPassword(
      email,
      password
    );

    if (authResponse.user === null) throw Error('Null firebase user id');
    return {
      success: true,
      data: {
        token: await authResponse.user.getIdToken(),
        userId: authResponse.user.uid,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const checkLoginToken = async (
  token: string
): Promise<
  DatabaseResult<{
    userId: string;
    email: string;
  }>
> => {
  const { auth, adminAuth } = getFirebaseReference();
  try {
    const verifyTokenResult = await adminAuth.verifyIdToken(token, true);
    if (verifyTokenResult.email === undefined) throw Error('Undefined email');
    const authUser = await adminAuth.getUserByEmail(verifyTokenResult.email);
    return {
      success: true,
      data: {
        userId: authUser.uid,
        email: verifyTokenResult.email,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const signOutAllAcounts = async (
  token: string
): Promise<DatabaseResult<null>> => {
  const userResult = await checkLoginToken(token);
  if (!userResult.success) {
    return userResult;
  }
  const { auth, adminAuth } = getFirebaseReference();
  try {
    await adminAuth.revokeRefreshTokens(userResult.data.userId);
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }

  return {
    success: true,
    data: null,
  };
};

const signInWithEmailAndPassword = async (
  email: string,
  password: string,
  needVerifiedEmail?: boolean
): Promise<
  DatabaseResult<{ token: string; userId: string; emailVerified: boolean }>
> => {
  const { auth, adminAuth } = getFirebaseReference();
  try {
    const authResponse = await auth.signInWithEmailAndPassword(email, password);
    if (authResponse.user === null) throw Error('Null firebase user id');

    if (
      needVerifiedEmail !== undefined &&
      needVerifiedEmail &&
      !authResponse.user.emailVerified
    ) {
      await authResponse.user.sendEmailVerification();
    }

    return {
      success: true,
      data: {
        token: await authResponse.user.getIdToken(),
        userId: authResponse.user.uid,
        emailVerified: authResponse.user.emailVerified,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const updateEmailAndPassword = async (
  token: string,
  email: string,
  password: string
): Promise<DatabaseResult<{ token: string; userId: string }>> => {
  const { adminAuth } = getFirebaseReference();
  const userResult = await checkLoginToken(token);
  if (!userResult.success) {
    return userResult;
  }
  try {
    await adminAuth.updateUser(userResult.data.userId, {
      email: email,
      password: password,
    });
    return await signInWithEmailAndPassword(email, password);
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

const deleteAccount = async (token: string): Promise<DatabaseResult<null>> => {
  const userResult = await checkLoginToken(token);

  if (!userResult.success) {
    return userResult;
  }
  const { adminAuth } = getFirebaseReference();
  const { userId } = userResult.data;
  try {
    await adminAuth.deleteUser(userId);
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }

  return {
    success: true,
    data: null,
  };
};

const requestResetPassword = async (
  email: string
): Promise<DatabaseResult<null>> => {
  try {
    const { auth, adminAuth } = getFirebaseReference();
    await auth.sendPasswordResetEmail(email);

    return {
      success: true,
      data: null,
    };
  } catch (e) {
    return {
      success: false,
      error: e as Error,
    };
  }
};

export default {
  createAuthAccount,
  checkLoginToken,
  signOutAllAcounts,
  signInWithEmailAndPassword,
  updateEmailAndPassword,
  deleteAccount,
  requestResetPassword,
};
