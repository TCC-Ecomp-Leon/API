"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInNavigation = void 0;
const signInHandler_1 = require("../../handlers/auth/signInHandler");
const models_1 = require("../../models");
const RepositorioPerfil_1 = __importDefault(require("../../services/repositories/RepositorioPerfil"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const navigation_1 = __importDefault(require("../../structure/navigation"));
exports.signInNavigation = new navigation_1.default([
    signInHandler_1.signInHandler(async (userId, email, emailVerificado, db, session) => {
        const profile = await RepositorioPerfil_1.default.readPerfil(userId, email, emailVerificado, db, session);
        if (!profile.success) {
            throw profile.error;
        }
        if (profile.data.regra === models_1.RegraPerfil.Projeto) {
            const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(profile.data.email, db, session);
            if (!readProjeto.success) {
                throw readProjeto.error;
            }
            return {
                success: true,
                data: {
                    profile: profile.data,
                    projeto: readProjeto.data,
                },
            };
        }
        return {
            success: true,
            data: {
                profile: profile.data,
            },
        };
    }),
]);
//# sourceMappingURL=signInNavigation.js.map