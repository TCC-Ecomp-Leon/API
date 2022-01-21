"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removerCursoUniversitarioHandler = void 0;
const database_1 = require("../../config/database");
const RepositorioCursoUniversitario_1 = __importDefault(require("../../services/repositories/RepositorioCursoUniversitario"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.removerCursoUniversitarioHandler = new handler_1.default(async (context) => {
    const idCursoUniversitario = context.params['id'];
    const service = async (db, session) => {
        const result = await RepositorioCursoUniversitario_1.default.deleteCursoUniversitario(idCursoUniversitario, db, session);
        if (!result.success) {
            return {
                status: 404,
                body: {
                    error: 'CURSO_NAO_ENCONTRADO',
                },
            };
        }
        return {
            status: 200,
            body: null,
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=removerCursoUniversitario.js.map