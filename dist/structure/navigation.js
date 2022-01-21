"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentProfile = exports.ProtectedNavigation = exports.getProfile = void 0;
const authHandler_1 = require("../handlers/auth/authHandler");
const RepositorioPerfil_1 = __importDefault(require("../services/repositories/RepositorioPerfil"));
class Navigation {
    constructor(handlers) {
        this.handlers = handlers;
    }
    async navigate(context) {
        for (let i = 0; i < this.handlers.length; i++) {
            try {
                const handler = this.handlers[i];
                const result = await handler.run(context);
                if (result !== null) {
                    return { ...result, success: true };
                }
            }
            catch (e) {
                return {
                    success: false,
                    error: e,
                };
            }
        }
        return { error: Error('Handlers without response'), success: false };
    }
}
exports.default = Navigation;
const getProfile = async (userId, email, verifiedEmail, session, db) => {
    const profile = await RepositorioPerfil_1.default.readPerfil(userId, email, verifiedEmail, db, session);
    return profile;
};
exports.getProfile = getProfile;
const ProtectedNavigation = (handlers, roleFunction) => {
    return new Navigation([authHandler_1.authHandler(exports.getProfile, roleFunction), ...handlers]);
};
exports.ProtectedNavigation = ProtectedNavigation;
const getCurrentProfile = (context) => {
    const profile = context.getVariable('profile');
    if (profile === undefined) {
        throw Error('Wrong usage of the protected navigation');
    }
    return profile;
};
exports.getCurrentProfile = getCurrentProfile;
//# sourceMappingURL=navigation.js.map