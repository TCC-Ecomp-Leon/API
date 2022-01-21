"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("../data/Database"));
const collection = 'Universitario';
const sufixoEmailInstitucional = 'unifesp.br';
const emailInstitucionalValido = (email) => {
    const fields = email.split('@');
    if (fields.length !== 2)
        return false;
    return fields[1] === sufixoEmailInstitucional;
};
const readInformacoesUniversitario = async (email, emailValidado, db, session) => {
    if (!emailValidado || !emailInstitucionalValido(email)) {
        return {
            success: true,
            data: {
                universitario: false,
            },
        };
    }
    else {
        const identificadorUniversitario = 'email';
        const informacoes = await Database_1.default.readData(collection, [{ key: identificadorUniversitario, value: email }], db, session);
        if (!informacoes.success) {
            const informacoesUniversitario = {
                graduacao: undefined,
                email: email,
                atividadesQueColaborou: [],
            };
            const gravarInformacoes = await Database_1.default.addData(collection, informacoesUniversitario, db, session);
            if (!gravarInformacoes.success) {
                throw gravarInformacoes.error;
            }
            return {
                success: true,
                data: {
                    universitario: true,
                    ...informacoesUniversitario,
                },
            };
        }
        return {
            success: true,
            data: {
                universitario: true,
                ...informacoes.data,
            },
        };
    }
};
const atualizarCurso = async (emailUniversitario, curso, db, session) => {
    const identificadorUniversitario = 'email';
    const campoGraduacao = 'graduacao';
    const atualizacao = {
        atualizadoEm: new Date(),
        curso: curso,
    };
    return Database_1.default.updateGenericData(collection, [{ key: identificadorUniversitario, value: emailUniversitario }], [{ key: campoGraduacao, value: atualizacao }], db, session);
};
const atrelarColaboracao = (emailUniversitario, idResposta, idAtividade, horasConfiguradas, db, session, aprovada) => {
    const identificadorUniversitario = 'email';
    const campoColaboracoes = 'atividadesQueColaborou';
    let colaboracao = {
        idResposta: idResposta,
        idAtividade: idAtividade,
        horas: horasConfiguradas,
        aprovado: false,
    };
    if (aprovada) {
        colaboracao = {
            ...colaboracao,
            aprovado: true,
            horasEmitidas: false,
        };
    }
    return Database_1.default.updatePushData(collection, [{ key: identificadorUniversitario, value: emailUniversitario }], campoColaboracoes, colaboracao, db, session);
};
const aprovarAtividades = (idRespostas, db, session) => {
    const campoPesquisaAtividades = 'idResposta';
    const campoAprovar = 'atividadesQueColaborou.$[].aprovado';
    return Database_1.default.updateGenericDatas(collection, [{ key: campoPesquisaAtividades, value: { $in: idRespostas } }], [{ key: campoAprovar, value: true }], db, session);
};
const registrarEmissaoHoras = (idRespostas, db, session) => {
    const campoPesquisaAtividades = 'idResposta';
    const campoEmissao = 'atividadesQueColaborou.$[].horasEmitidas';
    return Database_1.default.updateGenericDatas(collection, [{ key: campoPesquisaAtividades, value: { $in: idRespostas } }], [{ key: campoEmissao, value: true }], db, session);
};
const lerAtividadesNecessitandoAprovacao = async (db, session) => {
    const campoPesquisa = 'atividadesQueColaborou.atividadesQueColaborou.aprovado';
    const informacoes = await Database_1.default.readDatas(collection, [{ key: campoPesquisa, value: false }], db, session);
    let lista = [];
    if (!informacoes.success)
        return informacoes;
    informacoes.data.forEach((informacao) => {
        lista = [...lista, ...informacao.atividadesQueColaborou];
    });
    return {
        success: true,
        data: lista,
    };
};
exports.default = {
    emailInstitucionalValido,
    readInformacoesUniversitario,
    atualizarCurso,
    atrelarColaboracao,
    registrarEmissaoHoras,
    aprovarAtividades,
    lerAtividadesNecessitandoAprovacao,
};
//# sourceMappingURL=RepositorioUniversitario.js.map