"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarDuvidaHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const duvida_1 = require("../../schemas/duvida");
const RepositorioCursoUniversitario_1 = __importDefault(require("../../services/repositories/RepositorioCursoUniversitario"));
const RepositorioDuvida_1 = __importDefault(require("../../services/repositories/RepositorioDuvida"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.criarDuvidaHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    const body = context.body;
    if (!duvida_1.DuvidaValidator(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(duvida_1.DuvidaValidator.errors),
            },
        };
    }
    const informacoes = body;
    const { titulo, descricao, idCurso, idMateria, primeiraMensagem, idCursoUniversitario, } = informacoes;
    if (userProfile.regra !== models_1.RegraPerfil.Geral ||
        !userProfile.associacoes.aluno.alunoParceiro) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const cursosAluno = userProfile.associacoes.aluno.cursos;
    let materiasAluno = [];
    cursosAluno.forEach((curso) => {
        materiasAluno = [...materiasAluno, ...curso.materias];
    });
    if (cursosAluno.find((curso) => curso.id === idCurso) === undefined ||
        (idMateria !== null &&
            materiasAluno.find((materia) => materia.id === idMateria) === undefined)) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const service = async (db, session) => {
        if (idCursoUniversitario !== null) {
            const leituraCursoUniversitario = await RepositorioCursoUniversitario_1.default.readCursoUniversitario(idCursoUniversitario, db, session);
            if (!leituraCursoUniversitario.success) {
                return {
                    status: 404,
                    body: {
                        error: 'CURSO_NAO_ENCONTRADO',
                    },
                };
            }
        }
        const result = await RepositorioDuvida_1.default.adicionarDuvida(titulo, descricao, userProfile.id, idCurso, idMateria, primeiraMensagem, idCursoUniversitario, db, session);
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
//# sourceMappingURL=criarDuvida.js.map