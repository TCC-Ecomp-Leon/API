import { DatabaseResult } from '../../../structure/databaseResult';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import environmentVariables from '../../../config/environmentVariables';

const localUsersFile = () => {
  const env = environmentVariables();
  if (env.ENV !== 'LOCAL' && env.ENV !== 'TEST')
    if (env.ENV !== 'PROD' && env.ENV !== 'BETA')
      throw Error('Wrong usage of offline firebase auth');
  if (env.ENV === 'LOCAL') return './.localAuth.json';
  else return './.localAuth.test.json';
};

type User = {
  email: string;
  password: string;
  userId: string;
  token: string | null;
};

const readLocalUsers = async (): Promise<DatabaseResult<Array<User>>> => {
  try {
    if (!fs.existsSync(localUsersFile())) {
      return { success: true, data: [] };
    }
    const read = fs.readFileSync(localUsersFile(), { encoding: 'utf8' });

    if (read.length === 0) return { success: true, data: [] };

    return { success: true, data: JSON.parse(read) as Array<User> };
  } catch (e) {
    return { success: false, error: e };
  }
};

const writeLocalUsers = async (
  users: Array<User>
): Promise<DatabaseResult<null>> => {
  try {
    fs.writeFileSync(localUsersFile(), JSON.stringify(users), {
      encoding: 'utf8',
    });

    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e };
  }
};

const createAuthAccount = async (
  email: string,
  password: string
): Promise<DatabaseResult<{ token: string; userId: string }>> => {
  try {
    const env = environmentVariables();
    if (env.ENV !== 'LOCAL' && env.ENV !== 'TEST')
      throw Error('Wrong usage of local firebase auth');

    if (email.length < 1 || password.length < 1)
      return { success: false, error: Error('Invalid password or email') };

    const readUsers = await readLocalUsers();
    if (!readUsers.success) {
      return { success: false, error: readUsers.error };
    }

    if (readUsers.data.find((user) => user.email === email) !== undefined) {
      return {
        success: false,
        error: Error('That email already have an account'),
      };
    }

    const userId: string = uuid();
    const token: string = jwt.sign({ data: uuid() }, env.JWT_SECRET);

    const user: User = {
      email: email,
      password: password,
      userId: userId,
      token: token,
    };

    const writeUserResult = await writeLocalUsers([...readUsers.data, user]);
    if (!writeUserResult.success) {
      return { success: false, error: writeUserResult.error };
    }

    return {
      success: true,
      data: {
        token: token,
        userId: userId,
      },
    };
  } catch (e) {
    return { success: false, error: e };
  }
};

const checkLoginToken = async (
  token: string
): Promise<
  DatabaseResult<{
    userId: string;
    email: string;
    verifiedEmail: boolean;
  }>
> => {
  try {
    const readUsers = await readLocalUsers();
    if (!readUsers.success) {
      return { success: false, error: readUsers.error };
    }

    const user = readUsers.data.find((user) => user.token === token);

    if (user === undefined) {
      return { success: false, error: Error('Wrong token') };
    }

    return {
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        verifiedEmail: true,
      },
    };
  } catch (e) {
    return { success: false, error: e };
  }
};

const signOutAllAcounts = async (
  token: string
): Promise<DatabaseResult<null>> => {
  try {
    const checkLogin = await checkLoginToken(token);

    if (!checkLogin.success) return checkLogin;

    const readUsers = await readLocalUsers();
    if (!readUsers.success) {
      return { success: false, error: readUsers.error };
    }

    const users = readUsers.data;

    const user = users.find((user) => user.token === token);
    if (user === undefined) {
      return {
        success: false,
        error: Error("That user doesn't have an account"),
      };
    }

    const index = users.indexOf(user, 0);

    users[index] = {
      ...users[index],
      token: null,
    };

    const writeUserResult = await writeLocalUsers(users);
    if (!writeUserResult.success) {
      return { success: false, error: writeUserResult.error };
    }

    return {
      success: true,
      data: null,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
};

const signInWithEmailAndPassword = async (
  email: string,
  password: string,
  needVerifiedEmail?: boolean
): Promise<
  DatabaseResult<{ token: string; userId: string; emailVerified: boolean }>
> => {
  try {
    const env = environmentVariables();
    if (env.ENV !== 'LOCAL' && env.ENV !== 'TEST')
      throw Error('Wrong usage of local firebase auth');

    if (email.length < 1 || password.length < 1)
      return { success: false, error: Error('Invalid password or email') };

    const readUsers = await readLocalUsers();
    if (!readUsers.success) {
      return { success: false, error: readUsers.error };
    }

    const users = readUsers.data;

    const user = users.find((user) => user.email === email);
    if (user === undefined) {
      return {
        success: false,
        error: Error("That user doesn't have an account"),
      };
    }

    const token: string = jwt.sign({ data: uuid() }, env.JWT_SECRET);

    const index = users.indexOf(user, 0);

    users[index] = {
      ...users[index],
      token: token,
    };

    const writeUserResult = await writeLocalUsers(users);
    if (!writeUserResult.success) {
      return { success: false, error: writeUserResult.error };
    }

    return {
      success: true,
      data: {
        token: token,
        userId: user.userId,
        emailVerified: true,
      },
    };
  } catch (e) {
    return { success: false, error: e };
  }
};

const updateEmailAndPassword = async (
  token: string,
  email: string,
  password: string
): Promise<DatabaseResult<{ token: string; userId: string }>> => {
  try {
    const env = environmentVariables();
    if (env.ENV !== 'LOCAL' && env.ENV !== 'TEST')
      throw Error('Wrong usage of local firebase auth');

    if (email.length < 1 || password.length < 1)
      return { success: false, error: Error('Invalid password or email') };

    const readUsers = await readLocalUsers();
    if (!readUsers.success) {
      return { success: false, error: readUsers.error };
    }

    const users = readUsers.data;

    const user = users.find((user) => user.token === token);
    if (user === undefined) {
      return {
        success: false,
        error: Error("That user doesn't have an account"),
      };
    }

    const newToken: string = jwt.sign({ data: uuid() }, env.JWT_SECRET);

    const index = users.indexOf(user, 0);

    users[index] = {
      ...users[index],
      email: email,
      password: password,
      token: newToken,
    };

    const writeUserResult = await writeLocalUsers(users);
    if (!writeUserResult.success) {
      return { success: false, error: writeUserResult.error };
    }

    return {
      success: true,
      data: {
        token: newToken,
        userId: user.userId,
      },
    };
  } catch (e) {
    return { success: false, error: e };
  }
};

const deleteAccount = async (token: string): Promise<DatabaseResult<null>> => {
  try {
    const checkLogin = await checkLoginToken(token);

    if (!checkLogin.success) return checkLogin;

    const readUsers = await readLocalUsers();
    if (!readUsers.success) {
      return { success: false, error: readUsers.error };
    }

    const users = readUsers.data;

    const user = users.find((user) => user.token === token);
    if (user === undefined) {
      return {
        success: false,
        error: Error("That user doesn't have an account"),
      };
    }

    const index = users.indexOf(user, 0);

    users.splice(index, 1);

    const writeUserResult = await writeLocalUsers(users);
    if (!writeUserResult.success) {
      return { success: false, error: writeUserResult.error };
    }

    return {
      success: true,
      data: null,
    };
  } catch (e) {
    return {
      success: false,
      error: e,
    };
  }
};

const readAuthProfile = async (
  id: string
): Promise<DatabaseResult<{ email: string; emailVerified: boolean }>> => {
  const readUsers = await readLocalUsers();
  if (!readUsers.success) {
    return { success: false, error: readUsers.error };
  }

  const find = readUsers.data.find((user) => user.userId === id);
  if (find === undefined) {
    return {
      success: false,
      error: Error("That user doesn't have an account"),
    };
  }

  return {
    success: true,
    data: {
      email: find.email,
      emailVerified: false,
    },
  };
};

export default {
  createAuthAccount,
  checkLoginToken,
  signOutAllAcounts,
  signInWithEmailAndPassword,
  updateEmailAndPassword,
  deleteAccount,
  readAuthProfile,
};
