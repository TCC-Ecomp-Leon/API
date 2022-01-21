"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHandler = void 0;
const database_1 = require("../../config/database");
const firebaseAuth_1 = require("../../services/authentification/firebaseAuth");
const handler_1 = __importDefault(require("../../structure/handler"));
const authHandler = (getProfile, roleFunction) => new handler_1.default(async (context) => {
    const authToken = context.getAuthToken();
    if (authToken === null)
        return {
            status: 401,
            body: {
                error: 'REQUEST_WITHOUT_TOKEN',
            },
        };
    const authResult = await firebaseAuth_1.checkLoginToken(authToken);
    if (!authResult.success) {
        return {
            status: 401,
            body: {
                error: 'INVALID_TOKEN',
            },
        };
    }
    const service = async (db, session) => {
        const profileResult = await getProfile(authResult.data.userId, authResult.data.email, authResult.data.verifiedEmail, session, db);
        if (!profileResult.success) {
            throw profileResult.error;
        }
        if (profileResult.data === null) {
            return {
                status: 404,
                body: {
                    error: 'PROFILE_NOT_FOUND',
                },
            };
        }
        if (roleFunction !== undefined) {
            if (!roleFunction(profileResult.data)) {
                return {
                    status: 403,
                    body: {
                        error: 'NOT_AUTHORIZED',
                    },
                };
            }
        }
        context.setVariable('profile', profileResult.data);
        return null;
    };
    return await database_1.withDatabaseTransaction(service);
});
exports.authHandler = authHandler;
//# sourceMappingURL=authHandler.js.map