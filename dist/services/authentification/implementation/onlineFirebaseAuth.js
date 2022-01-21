"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("firebase"));
const admin = __importStar(require("firebase-admin"));
const environmentVariables_1 = __importDefault(require("../../../config/environmentVariables"));
let db = undefined;
let auth = undefined;
let adminAuth = undefined;
const getFirebaseReference = () => {
    if (db === undefined || auth === undefined || adminAuth === undefined) {
        const env = environmentVariables_1.default();
        if (env.ENV !== 'PROD' && env.ENV !== 'BETA')
            throw Error('Wrong usage of online firebase auth');
        const serviceAccount = env.ENV === 'PROD'
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
        firebase_1.default.initializeApp(firebaseConfig);
        admin.initializeApp(firebaseAdminConfig);
        db = admin.database();
        auth = firebase_1.default.auth();
        adminAuth = admin.auth();
    }
    return { db: db, auth: auth, adminAuth: adminAuth };
};
const createAuthAccount = async (email, password) => {
    const { auth, adminAuth } = getFirebaseReference();
    try {
        const authResponse = await auth.createUserWithEmailAndPassword(email, password);
        if (authResponse.user === null)
            throw Error('Null firebase user id');
        return {
            success: true,
            data: {
                token: await authResponse.user.getIdToken(),
                userId: authResponse.user.uid,
            },
        };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const checkLoginToken = async (token) => {
    const { auth, adminAuth } = getFirebaseReference();
    try {
        const verifyTokenResult = await adminAuth.verifyIdToken(token, true);
        if (verifyTokenResult.email === undefined)
            throw Error('Undefined email');
        const authUser = await adminAuth.getUserByEmail(verifyTokenResult.email);
        return {
            success: true,
            data: {
                userId: authUser.uid,
                email: verifyTokenResult.email,
                verifiedEmail: authUser.emailVerified,
            },
        };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const signOutAllAcounts = async (token) => {
    const userResult = await checkLoginToken(token);
    if (!userResult.success) {
        return userResult;
    }
    const { auth, adminAuth } = getFirebaseReference();
    try {
        await adminAuth.revokeRefreshTokens(userResult.data.userId);
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
    return {
        success: true,
        data: null,
    };
};
const signInWithEmailAndPassword = async (email, password, needVerifiedEmail) => {
    const { auth, adminAuth } = getFirebaseReference();
    try {
        const authResponse = await auth.signInWithEmailAndPassword(email, password);
        if (authResponse.user === null)
            throw Error('Null firebase user id');
        if (needVerifiedEmail !== undefined &&
            needVerifiedEmail &&
            !authResponse.user.emailVerified) {
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
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const updateEmailAndPassword = async (token, email, password) => {
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
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
const deleteAccount = async (token) => {
    const userResult = await checkLoginToken(token);
    if (!userResult.success) {
        return userResult;
    }
    const { adminAuth } = getFirebaseReference();
    const { userId } = userResult.data;
    try {
        await adminAuth.deleteUser(userId);
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
    return {
        success: true,
        data: null,
    };
};
const requestResetPassword = async (email) => {
    try {
        const { auth, adminAuth } = getFirebaseReference();
        await auth.sendPasswordResetEmail(email);
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
    try {
        const { auth, adminAuth } = getFirebaseReference();
        const user = await adminAuth.getUser(id);
        if (user.email === undefined) {
            return {
                success: false,
                error: Error('User without email'),
            };
        }
        return {
            success: true,
            data: {
                email: user.email,
                emailVerified: user.emailVerified,
            },
        };
    }
    catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
exports.default = {
    createAuthAccount,
    checkLoginToken,
    signOutAllAcounts,
    signInWithEmailAndPassword,
    updateEmailAndPassword,
    deleteAccount,
    requestResetPassword,
    readAuthProfile,
};
//# sourceMappingURL=onlineFirebaseAuth.js.map