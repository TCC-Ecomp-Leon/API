"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aprovarProjetoHandler = void 0;
const database_1 = require("../../config/database");
const firebaseAuth_1 = require("../../services/authentification/firebaseAuth");
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const generate_password_1 = __importDefault(require("generate-password"));
const RepositorioPerfil_1 = __importDefault(require("../../services/repositories/RepositorioPerfil"));
exports.aprovarProjetoHandler = new handler_1.default(async (context) => {
    const idProjeto = context.params['id'];
    const service = async (db, session) => {
        const readProjeto = await RepositorioProjeto_1.default.readProjeto(idProjeto, db, session);
        if (!readProjeto.success) {
            return {
                status: 404,
                body: {
                    error: 'PROJETO_NAO_ENCONTRADO',
                },
            };
        }
        const projeto = readProjeto.data;
        if (projeto.aprovado) {
            return {
                status: 406,
                body: {
                    error: 'PROJETO_JA_APROVADO',
                },
            };
        }
        const registerResult = await firebaseAuth_1.createAuthAccount(projeto.email, generate_password_1.default.generate({
            length: 10,
            numbers: true,
        }));
        if (!registerResult.success) {
            return {
                status: 406,
                body: {
                    error: 'CANT_REGISTER_THAT_PROFILE',
                },
            };
        }
        const resultAprovarProjeto = await RepositorioPerfil_1.default.addPerfilProjeto(registerResult.data.userId, projeto.email, db, session);
        if (!resultAprovarProjeto.success) {
            await firebaseAuth_1.deleteAccount(registerResult.data.token);
            throw resultAprovarProjeto.error;
        }
        // TODO: Enviar um email com essa senha gerada
        const resetPassword = await firebaseAuth_1.requestResetPassword(projeto.email);
        if (!resetPassword.success) {
            throw resetPassword.error;
        }
        return {
            status: 200,
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=aprovarProjeto.js.map