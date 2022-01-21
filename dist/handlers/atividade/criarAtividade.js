"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarAtividadeHandler = void 0;
const database_1 = require("../../config/database");
const models_1 = require("../../models");
const atividade_1 = require("../../schemas/atividade");
const RepositorioAtividade_1 = __importDefault(require("../../services/repositories/RepositorioAtividade"));
const RepositorioProjeto_1 = __importDefault(require("../../services/repositories/RepositorioProjeto"));
const handler_1 = __importDefault(require("../../structure/handler"));
const navigation_1 = require("../../structure/navigation");
const uuid_1 = require("uuid");
exports.criarAtividadeHandler = new handler_1.default(async (context) => {
    const userProfile = navigation_1.getCurrentProfile(context);
    if (userProfile.regra !== models_1.RegraPerfil.Projeto) {
        return {
            status: 403,
            body: {
                error: 'NOT_AUTHORIZED',
            },
        };
    }
    const body = context.body;
    if (!atividade_1.InformacoesAtividadeValidator(body)) {
        return {
            status: 400,
            body: {
                error: JSON.stringify(atividade_1.InformacoesAtividadeValidator.errors),
            },
        };
    }
    const informacoesAtividade = body;
    const service = async (db, session) => {
        let result;
        const { idCurso, idMateria, idProjeto } = informacoesAtividade;
        const leituraProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(userProfile.email, db, session);
        if (!leituraProjeto.success) {
            throw leituraProjeto.error;
        }
        const projeto = leituraProjeto.data;
        if (!projeto.aprovado || idProjeto !== projeto.id) {
            return {
                status: 403,
                body: {
                    error: 'NOT_AUTHORIZED',
                },
            };
        }
        const pesquisaCursoMateria = projeto.cursos.find((curso) => {
            if (curso.id !== idCurso)
                return false;
            if (idMateria !== null) {
                const pesquisaMateria = curso.materias.find((materia) => materia.id === idMateria);
                if (pesquisaMateria === undefined)
                    return false;
            }
            return true;
        });
        if (pesquisaCursoMateria === undefined) {
            return {
                status: 400,
                body: {
                    error: 'Matéria ou cursos inseridos incorretamente',
                },
            };
        }
        if (informacoesAtividade.tipo === models_1.TipoAtividade.Alternativa) {
            const { nome, aberturaRespostas, fechamentoRespostas, notaReferencia, questoes, } = informacoesAtividade;
            result = await RepositorioAtividade_1.default.addAtividadeAlternativa(nome, idProjeto, idCurso, idMateria, new Date(aberturaRespostas), new Date(fechamentoRespostas), notaReferencia, questoes.map((questao) => ({ ...questao, idQuestao: uuid_1.v4() })), db, session);
        }
        else if (informacoesAtividade.tipo === models_1.TipoAtividade.BancoDeQuestoes) {
            const { nome, aberturaRespostas, fechamentoRespostas, assuntos, tempoColaboracao, } = informacoesAtividade;
            result = await RepositorioAtividade_1.default.addAtividadeBancoDeQuestoes(nome, idProjeto, idCurso, idMateria, new Date(aberturaRespostas), new Date(fechamentoRespostas), assuntos, tempoColaboracao, db, session);
        }
        else if (informacoesAtividade.tipo === models_1.TipoAtividade.Dissertativa) {
            const { nome, aberturaRespostas, fechamentoRespostas, fechamentoCorrecoes, notaReferencia, tempoColaboracao, questoes, } = informacoesAtividade;
            result = await RepositorioAtividade_1.default.addAtividadeDissertativa(nome, idProjeto, idCurso, idMateria, new Date(aberturaRespostas), new Date(fechamentoRespostas), new Date(fechamentoCorrecoes), notaReferencia, questoes.map((questao) => ({ ...questao, idQuestao: uuid_1.v4() })), tempoColaboracao, db, session);
        }
        else {
            throw Error('Algo errado com o tipo de uma atividade');
        }
        if (!result.success) {
            throw result.error;
        }
        const leituraAtividade = await RepositorioAtividade_1.default.lerAtividade(result.data, db, session);
        if (!leituraAtividade.success) {
            throw leituraAtividade.error;
        }
        return {
            status: 200,
            body: {
                atividade: leituraAtividade.data,
            },
        };
    };
    return await database_1.withDatabaseTransaction(service);
});
//# sourceMappingURL=criarAtividade.js.map