"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileHandler = void 0;
const database_1 = require("../../config/database");
const firebaseAuth_1 = require("../../services/authentification/firebaseAuth");
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.getProfileHandler = new handler_1.default(async (context) => {
    const service = async (db, session) => {
        const profileId = context.params['id'];
        const authInfo = await firebaseAuth_1.readAuthProfile(profileId);
        if (!authInfo.success) {
            return {
                status: 404,
                body: {
                    error: 'PROFILE_NOT_FOUND',
                },
            };
        }
        const profileResult = await navigation_1.getProfile(profileId, authInfo.data.email, authInfo.data.emailVerified, session, db);
        if (!profileResult.success || profileResult.data === null) {
            return {
                status: 404,
                body: {
                    error: 'PROFILE_NOT_FOUND',
                },
            };
        }
        return {
            status: 200,
            body: profileResult.data,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=getProfile.js.map