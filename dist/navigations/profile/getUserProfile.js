"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileNavigation = void 0;
const navigation_1 = require("../../structure/navigation");
const models_1 = require("../../models");
const handler_1 = __importDefault(require("../../structure/handler"));
const database_1 = require("../../config/database");
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
exports.getUserProfileNavigation = navigation_1.ProtectedNavigation([
    new handler_1.default(async (context) => {
        const perfil = context.getVariable('profile');
        if (perfil.regra === models_1.RegraPerfil.Projeto) {
            const service = async (db, session) => {
                const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(perfil.email, db, session);
                if (!readProjeto.success) {
                    throw readProjeto.error;
                }
                return readProjeto.data;
            };
            return {
                status: 200,
                body: {
                    profile: perfil,
                    projeto: await database_1.withDatabaseTransaction(service),
                },
            };
        }
        return {
            status: 200,
            body: {
                profile: perfil,
            },
        };
    }),
]);
//# sourceMappingURL=getUserProfile.js.map