"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCursosUniversitariosHandler = void 0;
const database_1 = require("../../config/database");
const RepositorioCursoUniversitario_1 = __importDefault(require("../../services/repositories/RepositorioCursoUniversitario"));
const handler_1 = __importDefault(require("../../structure/handler"));
exports.getCursosUniversitariosHandler = new handler_1.default(async (context) => {
    const service = async (db, session) => {
        const leituraCursos = await RepositorioCursoUniversitario_1.default.readCursosUniversitarios(db, session);
        if (!leituraCursos.success) {
            throw leituraCursos.error;
        }
        return {
            status: 200,
            body: {
                cursosUniversitarios: leituraCursos.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=getCursosUniversitarios.js.map