"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listaDeDuvidasHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const RepositorioDuvida_1 = __importDefault(require("../../services/repositories/RepositorioDuvida"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
exports.listaDeDuvidasHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    let idProjeto = undefined;
    if (context.query['projeto'] !== undefined) {
        idProjeto = context.query['projeto'];
    }
    const service = async (db, session) => {
        if (userProfile.regra === models_1.RegraPerfil.Projeto) {
            const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
            if (!readProjeto.success) {
                throw readProjeto.error;
            }
            idProjeto = readProjeto.data.id;
        }
        if (idProjeto !== undefined) {
            const leituraProjeto = await RepositorioProjeto_1.default.readProjeto(idProjeto, db, session);
            if (!leituraProjeto.success) {
                return {
                    status: 404,
                    body: {
                        error: 'PROJETO_NAO_ENCONTRADO',
                    },
                };
            }
            const projeto = leituraProjeto.data;
            if (!projeto.aprovado) {
                return {
                    status: 200,
                    body: {
                        duvidas: [],
                    },
                };
            }
            const duvidasCursos = await Promise.all(projeto.cursos.map(async (curso) => {
                return await RepositorioDuvida_1.default.readDuvidasEspecificas('idCursoAluno', curso.id, db, session);
            }));
            let duvidas = [];
            duvidasCursos.forEach((info) => {
                if (!info.success) {
                    throw info.error;
                }
                duvidas = [...duvidas, ...info.data];
            });
            return {
                status: 200,
                body: {
                    duvidas: duvidas,
                },
            };
        }
        else {
            const leitura = await RepositorioDuvida_1.default.readDuvidas(db, session);
            if (!leitura.success)
                throw leitura.error;
            return {
                status: 200,
                body: {
                    duvidas: leitura.data,
                },
            };
        }
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=listaDeDuvidas.js.map