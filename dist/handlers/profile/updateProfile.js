"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const RepositorioCursoUniversitario_1 = __importDefault(require("../../services/repositories/RepositorioCursoUniversitario"));
const RepositorioPerfil_1 = __importDefault(require("../../services/repositories/RepositorioPerfil"));
const RepositorioUniversitario_1 = __importDefault(require("../../services/repositories/RepositorioUniversitario"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.updateProfileHandler = new handler_1.default(async (context) => {
    const userProfile = context.getVariable('profile');
    const service = async (db, session) => {
        const updatingProfile = context.getVariable('updatingProfile');
        if (userProfile.regra !== models_1.RegraPerfil.Geral) {
            delete updatingProfile.cpf;
        }
        if (updatingProfile.email !== undefined) {
            delete updatingProfile.email;
        }
        if (updatingProfile.entradaEm !== undefined) {
            delete updatingProfile.entradaEm;
        }
        if (updatingProfile.id !== undefined) {
            delete updatingProfile.id;
        }
        const result = await RepositorioPerfil_1.default.atualizarPerfil(userProfile.id, updatingProfile, db, session);
        const updatingCursoUniversitario = context.getVariable('updatingCursoUniversitario');
        if (updatingCursoUniversitario !== undefined &&
            userProfile.regra === models_1.RegraPerfil.Geral &&
            userProfile.universitario.universitario) {
            const idCursoUniversitario = updatingCursoUniversitario.curso
                .id;
            const readCurso = await RepositorioCursoUniversitario_1.default.readCursoUniversitario(idCursoUniversitario, db, session);
            if (!readCurso.success) {
                throw readCurso.error;
            }
            const updateCursoResult = await RepositorioUniversitario_1.default.atualizarCurso(userProfile.email, readCurso.data, db, session);
            if (!updateCursoResult.success) {
                throw updateCursoResult.error;
            }
        }
        if (!result.success) {
            throw result.error;
        }
        return {
            status: 200,
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=updateProfile.js.map