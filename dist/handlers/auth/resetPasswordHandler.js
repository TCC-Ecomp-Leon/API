"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordHandler = void 0;
const database_1 = require("../../config/database");
const firebaseAuth_1 = require("../../services/authentification/firebaseAuth");
const RepositorioPerfil_1 = __importDefault(require("../../services/repositories/RepositorioPerfil"));
const handler_1 = __importDefault(require("../../structure/handler"));
const login_1 = require("../../schemas/login");
exports.resetPasswordHandler = new handler_1.default(async (context) => {
    const userProfile = context.getVariable('profile');
    const body = context.body;
    if (!login_1.LoginValidator(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(login_1.LoginValidator.errors),
            },
        };
    }
    const service = async (db, session) => {
        const alterarPerfil = await RepositorioPerfil_1.default.atualizarPerfil(userProfile.id, {
            email: body.email,
        }, db, session);
        if (!alterarPerfil.success) {
            throw alterarPerfil.error;
        }
        const alterarAuth = await firebaseAuth_1.updateEmailAndPassword(context.getAuthToken(), body.email, body.password);
        if (!alterarAuth.success) {
            throw alterarAuth.error;
        }
        return {
            status: 200,
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=resetPasswordHandler.js.map