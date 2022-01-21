"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const environmentVariables_1 = __importDefault(require("../../../config/environmentVariables"));
const localUsersFile = () => {
    const env = environmentVariables_1.default();
    if (env.ENV !== 'LOCAL' && env.ENV !== 'TEST')
        if (env.ENV !== 'PROD' && env.ENV !== 'BETA')
            throw Error('Wrong usage of offline firebase auth');
    if (env.ENV === 'LOCAL')
        return './.localAuth.json';
    else
        return './.localAuth.test.json';
};
const readLocalUsers = async () => {
    try {
        if (!fs_1.default.existsSync(localUsersFile())) {
            return { success: true, data: [] };
        }
        const read = fs_1.default.readFileSync(localUsersFile(), { encoding: 'utf8' });
        if (read.length === 0)
            return { success: true, data: [] };
        return { success: true, data: JSON.parse(read) };
    }
    catch (e) {
        return { success: false, error: e };
    }
};
const writeLocalUsers = async (users) => {
    try {
        fs_1.default.writeFileSync(localUsersFile(), JSON.stringify(users), {
            encoding: 'utf8',
        });
        return { success: true, data: null };
    }
    catch (e) {
        return { success: false, error: e };
    }
};
const createAuthAccount = async (email, password) => {
    try {
        const env = environmentVariables_1.default();
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
        const userId = uuid_1.v4();
        const token = jsonwebtoken_1.default.sign({ data: uuid_1.v4() }, env.JWT_SECRET);
        const user = {
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
    }
    catch (e) {
        return { success: false, error: e };
    }
};
const checkLoginToken = async (token) => {
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
    }
    catch (e) {
        return { success: false, error: e };
    }
};
const signOutAllAcounts = async (token) => {
    try {
        const checkLogin = await checkLoginToken(token);
        if (!checkLogin.success)
            return checkLogin;
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
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const signInWithEmailAndPassword = async (email, password, needVerifiedEmail) => {
    try {
        const env = environmentVariables_1.default();
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
        const token = jsonwebtoken_1.default.sign({ data: uuid_1.v4() }, env.JWT_SECRET);
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
    }
    catch (e) {
        return { success: false, error: e };
    }
};
const updateEmailAndPassword = async (token, email, password) => {
    try {
        const env = environmentVariables_1.default();
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
        const newToken = jsonwebtoken_1.default.sign({ data: uuid_1.v4() }, env.JWT_SECRET);
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
    }
    catch (e) {
        return { success: false, error: e };
    }
};
const deleteAccount = async (token) => {
    try {
        const checkLogin = await checkLoginToken(token);
        if (!checkLogin.success)
            return checkLogin;
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
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const readAuthProfile = async (id) => {
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
            emailVerified: true,
        },
    };
};
exports.default = {
    createAuthAccount,
    checkLoginToken,
    signOutAllAcounts,
    signInWithEmailAndPassword,
    updateEmailAndPassword,
    deleteAccount,
    readAuthProfile,
};
//# sourceMappingURL=localFirebaseAuth.js.map