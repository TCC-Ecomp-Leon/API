"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInHandler = void 0;
const firebaseAuth_1 = require("../../services/authentification/firebaseAuth");
const handler_1 = __importDefault(require("../../structure/handler"));
const login_1 = require("../../schemas/login");
const database_1 = require("../../config/database");
const signInHandler = (getProfile, necessarioValirEmail = false) => {
    return new handler_1.default(async (context) => {
        if (!login_1.LoginValidator(context.body)) {
            return {
                status: 400,
                body: {
                    error: JSON.stringify(login_1.LoginValidator.errors),
                },
            };
        }
        const email = context.body['email'];
        const password = context.body['password'];
        const authResult = await firebaseAuth_1.signInWithEmailAndPassword(email, password, necessarioValirEmail);
        if (!authResult.success) {
            return {
                status: 401,
                body: { error: 'INVALID_EMAIL_OR_PASSWORD' },
            };
        }
        const service = async (db, session) => {
            const email = context.body['email'];
            const profileResult = await getProfile(authResult.data.userId, email, authResult.data.emailVerified, db, session);
            if (!profileResult.success) {
                throw profileResult.error;
            }
            if (profileResult.data === null) {
                return {
                    status: 404,
                    body: { error: 'PROFILE_NOT_FOUND' },
                };
            }
            return {
                status: 200,
                body: {
                    ...profileResult.data,
                    authToken: authResult.data.token,
                },
            };
        };
        return await database_1.withDatabaseTransaction(service);
    });
};
exports.signInHandler = signInHandler;
//# sourceMappingURL=signInHandler.js.map