import { DatabaseResult } from '../../structure/databaseResult';
import localAuth from './implementation/localFirebaseAuth';
import onlineAuth from './implementation/onlineFirebaseAuth';
import environmentVariables from '../../config/environmentVariables';

export const createAuthAccount = async (
  email: string,
  password: string
): Promise<DatabaseResult<{ token: string; userId: string }>> => {
  if (environmentVariables().ENV === 'LOCAL') {
    return await localAuth.createAuthAccount(email, password);
  } else {
    return await onlineAuth.createAuthAccount(email, password);
  }
};

export const checkLoginToken = async (
  token: string
): Promise<
  DatabaseResult<{
    userId: string;
    email: string;
  }>
> => {
  if (environmentVariables().ENV === 'LOCAL') {
    return await localAuth.checkLoginToken(token);
  } else {
    return await onlineAuth.checkLoginToken(token);
  }
};

export const signOutAllAcounts = async (
  token: string
): Promise<DatabaseResult<null>> => {
  if (environmentVariables().ENV === 'LOCAL') {
    return await localAuth.signOutAllAcounts(token);
  } else {
    return await onlineAuth.signOutAllAcounts(token);
  }
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string,
  needVerifiedEmail?: boolean
): Promise<
  DatabaseResult<{ token: string; userId: string; emailVerified: boolean }>
> => {
  if (environmentVariables().ENV === 'LOCAL') {
    return await localAuth.signInWithEmailAndPassword(
      email,
      password,
      needVerifiedEmail
    );
  } else {
    return await onlineAuth.signInWithEmailAndPassword(
      email,
      password,
      needVerifiedEmail
    );
  }
};

export const updateEmailAndPassword = async (
  token: string,
  email: string,
  password: string
): Promise<DatabaseResult<{ token: string; userId: string }>> => {
  if (environmentVariables().ENV === 'LOCAL') {
    return await localAuth.updateEmailAndPassword(token, email, password);
  } else {
    return await onlineAuth.updateEmailAndPassword(token, email, password);
  }
};

export const deleteAccount = async (
  token: string
): Promise<DatabaseResult<null>> => {
  if (environmentVariables().ENV === 'LOCAL') {
    return await localAuth.deleteAccount(token);
  } else {
    return await onlineAuth.deleteAccount(token);
  }
};

export const requestResetPassword = async (
  email: string
): Promise<DatabaseResult<null>> => {
  if (environmentVariables().ENV === 'LOCAL') {
    throw Error(
      "Can't use request reset password in the local firebase implementation"
    );
  } else {
    return await onlineAuth.requestResetPassword(email);
  }
};
