"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAuthProfile = exports.requestResetPassword = exports.deleteAccount = exports.updateEmailAndPassword = exports.signInWithEmailAndPassword = exports.signOutAllAcounts = exports.checkLoginToken = exports.createAuthAccount = void 0;
const localFirebaseAuth_1 = __importDefault(require("./implementation/localFirebaseAuth"));
const onlineFirebaseAuth_1 = __importDefault(require("./implementation/onlineFirebaseAuth"));
const environmentVariables_1 = __importDefault(require("../../config/environmentVariables"));
const createAuthAccount = async (email, password) => {
    if (environmentVariables_1.default().ENV === 'LOCAL' ||
        environmentVariables_1.default().ENV === 'TEST') {
        return await localFirebaseAuth_1.default.createAuthAccount(email, password);
    }
    else {
        return await onlineFirebaseAuth_1.default.createAuthAccount(email, password);
    }
};
exports.createAuthAccount = createAuthAccount;
const checkLoginToken = async (token) => {
    if (environmentVariables_1.default().ENV === 'LOCAL' ||
        environmentVariables_1.default().ENV === 'TEST') {
        return await localFirebaseAuth_1.default.checkLoginToken(token);
    }
    else {
        return await onlineFirebaseAuth_1.default.checkLoginToken(token);
    }
};
exports.checkLoginToken = checkLoginToken;
const signOutAllAcounts = async (token) => {
    if (environmentVariables_1.default().ENV === 'LOCAL' ||
        environmentVariables_1.default().ENV === 'TEST') {
        return await localFirebaseAuth_1.default.signOutAllAcounts(token);
    }
    else {
        return await onlineFirebaseAuth_1.default.signOutAllAcounts(token);
    }
};
exports.signOutAllAcounts = signOutAllAcounts;
const signInWithEmailAndPassword = async (email, password, needVerifiedEmail) => {
    if (environmentVariables_1.default().ENV === 'LOCAL' ||
        environmentVariables_1.default().ENV === 'TEST') {
        return await localFirebaseAuth_1.default.signInWithEmailAndPassword(email, password, needVerifiedEmail);
    }
    else {
        return await onlineFirebaseAuth_1.default.signInWithEmailAndPassword(email, password, needVerifiedEmail);
    }
};
exports.signInWithEmailAndPassword = signInWithEmailAndPassword;
const updateEmailAndPassword = async (token, email, password) => {
    if (environmentVariables_1.default().ENV === 'LOCAL' ||
        environmentVariables_1.default().ENV === 'TEST') {
        return await localFirebaseAuth_1.default.updateEmailAndPassword(token, email, password);
    }
    else {
        return await onlineFirebaseAuth_1.default.updateEmailAndPassword(token, email, password);
    }
};
exports.updateEmailAndPassword = updateEmailAndPassword;
const deleteAccount = async (token) => {
    if (environmentVariables_1.default().ENV === 'LOCAL' ||
        environmentVariables_1.default().ENV === 'TEST') {
        return await localFirebaseAuth_1.default.deleteAccount(token);
    }
    else {
        return await onlineFirebaseAuth_1.default.deleteAccount(token);
    }
};
exports.deleteAccount = deleteAccount;
const requestResetPassword = async (email) => {
    if (environmentVariables_1.default().ENV === 'LOCAL' ||
        environmentVariables_1.default().ENV === 'TEST') {
        // throw Error(
        //   "Can't use request reset password in the local firebase implementation"
        // );
        return {
            success: true,
            data: null,
        };
    }
    else {
        return await onlineFirebaseAuth_1.default.requestResetPassword(email);
    }
};
exports.requestResetPassword = requestResetPassword;
const readAuthProfile = async (id) => {
    if (environmentVariables_1.default().ENV === 'LOCAL' ||
        environmentVariables_1.default().ENV === 'TEST') {
        return await localFirebaseAuth_1.default.readAuthProfile(id);
    }
    else {
        return await onlineFirebaseAuth_1.default.readAuthProfile(id);
    }
};
exports.readAuthProfile = readAuthProfile;
//# sourceMappingURL=firebaseAuth.js.map