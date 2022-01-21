"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SituacaoAtividadeLeitura = exports.collection = void 0;
const uuid_1 = require("uuid");
const models_1 = require("../../models");
const Database_1 = __importDefault(require("../data/Database"));
exports.collection = 'Atividade';
var SituacaoAtividadeLeitura;
(function (SituacaoAtividadeLeitura) {
    SituacaoAtividadeLeitura[SituacaoAtividadeLeitura["aberta"] = 0] = "aberta";
    SituacaoAtividadeLeitura[SituacaoAtividadeLeitura["fechada"] = 1] = "fechada";
    SituacaoAtividadeLeitura[SituacaoAtividadeLeitura["todas"] = 2] = "todas";
})(SituacaoAtividadeLeitura = exports.SituacaoAtividadeLeitura || (exports.SituacaoAtividadeLeitura = {}));
const addAtividadeAlternativa = async (nome, idProjeto, idCurso, idMateria, aberturaRespostas, fechamentoRespostas, notaReferencia, questoes, db, session) => {
    const atividade = {
        id: uuid_1.v4(),
        nome: nome,
        criadoEm: new Date(),
        idProjeto: idProjeto,
        idCurso: idCurso,
        idMateria: idMateria,
        tipoAtividade: models_1.TipoAtividade.Alternativa,
        fechamentoRespostas: fechamentoRespostas,
        aberturaRespostas: aberturaRespostas,
        notaReferencia: notaReferencia,
        itens: questoes,
    };
    const add = await Database_1.default.addData(exports.collection, atividade, db, session);
    if (!add.success)
        return add;
    return {
        success: true,
        data: atividade.id,
    };
};
const addAtividadeDissertativa = async (nome, idProjeto, idCurso, idMateria, aberturaRespostas, fechamentoRespostas, fechamentoCorrecoes, notaReferencia, questoes, tempoColaboracao, db, session) => {
    const atividade = {
        id: uuid_1.v4(),
        nome: nome,
        criadoEm: new Date(),
        idProjeto: idProjeto,
        idCurso: idCurso,
        idMateria: idMateria,
        tipoAtividade: models_1.TipoAtividade.Dissertativa,
        aberturaRespostas: aberturaRespostas,
        fechamentoRespostas: fechamentoRespostas,
        fechamentoCorrecoes: fechamentoCorrecoes,
        notaReferencia: notaReferencia,
        itens: questoes,
        tempoColaboracao: tempoColaboracao,
    };
    const add = await Database_1.default.addData(exports.collection, atividade, db, session);
    if (!add.success)
        return add;
    return {
        success: true,
        data: atividade.id,
    };
};
const addAtividadeBancoDeQuestoes = async (nome, idProjeto, idCurso, idMateria, aberturaRespostas, fechamentoRespostas, assuntos, tempoColaboracao, db, session) => {
    const atividade = {
        id: uuid_1.v4(),
        nome: nome,
        criadoEm: new Date(),
        idProjeto: idProjeto,
        idCurso: idCurso,
        idMateria: idMateria,
        tipoAtividade: models_1.TipoAtividade.BancoDeQuestoes,
        aberturaRespostas: aberturaRespostas,
        fechamentoRespostas: fechamentoRespostas,
        assuntos: assuntos,
        tempoColaboracao: tempoColaboracao,
    };
    const add = await Database_1.default.addData(exports.collection, atividade, db, session);
    if (!add.success)
        return add;
    return {
        success: true,
        data: atividade.id,
    };
};
const lerAtividade = async (id, db, session) => {
    return Database_1.default.readData(exports.collection, [{ key: 'id', value: id }], db, session);
};
const lerAtividadesDissertativas = (situacao, universitario, db, session, additionalFilter) => {
    const campoTipoAtividade = 'tipoAtividade';
    const campoFechamento = universitario ? 'fechamentoCorrecoes' : 'fechamentoRespostas';
    const searchFields = [
        {
            key: campoTipoAtividade,
            value: models_1.TipoAtividade.Dissertativa,
        },
    ];
    if (additionalFilter !== undefined) {
        searchFields.push({
            key: additionalFilter.key,
            value: additionalFilter.value,
        });
    }
    if (situacao !== undefined) {
        if (situacao === SituacaoAtividadeLeitura.aberta) {
            searchFields.push({ key: campoFechamento, value: { $gt: new Date() } });
        }
        else if (situacao === SituacaoAtividadeLeitura.fechada) {
            searchFields.push({ key: campoFechamento, value: { $lt: new Date() } });
        }
    }
    return Database_1.default.readDatas(exports.collection, searchFields, db, session);
};
const lerAtividadesBancoDeQuestoes = (situacao, db, session, additionalFilter) => {
    const campoTipoAtividade = 'tipoAtividade';
    const campoFechamento = 'fechamentoRespostas';
    const searchFields = [
        {
            key: campoTipoAtividade,
            value: models_1.TipoAtividade.BancoDeQuestoes,
        },
    ];
    if (additionalFilter !== undefined) {
        searchFields.push({
            key: additionalFilter.key,
            value: additionalFilter.value,
        });
    }
    if (situacao !== undefined) {
        if (situacao === SituacaoAtividadeLeitura.aberta) {
            searchFields.push({ key: campoFechamento, value: { $gt: new Date() } });
        }
        else if (situacao === SituacaoAtividadeLeitura.fechada) {
            searchFields.push({ key: campoFechamento, value: { $lt: new Date() } });
        }
    }
    return Database_1.default.readDatas(exports.collection, searchFields, db, session);
};
const lerAtividadesAlternativas = (situacao, db, session, additionalFilter) => {
    const campoTipoAtividade = 'tipoAtividade';
    const campoFechamento = 'fechamentoRespostas';
    const searchFields = [
        {
            key: campoTipoAtividade,
            value: models_1.TipoAtividade.Alternativa,
        },
    ];
    if (additionalFilter !== undefined) {
        searchFields.push({
            key: additionalFilter.key,
            value: additionalFilter.value,
        });
    }
    if (situacao !== undefined) {
        if (situacao === SituacaoAtividadeLeitura.aberta) {
            searchFields.push({ key: campoFechamento, value: { $gt: new Date() } });
        }
        else if (situacao === SituacaoAtividadeLeitura.fechada) {
            searchFields.push({ key: campoFechamento, value: { $lt: new Date() } });
        }
    }
    return Database_1.default.readDatas(exports.collection, searchFields, db, session);
};
const lerAtividadesEspecificas = async (key, value, situacao, aluno, universitario, db, session) => {
    let atividades = [];
    if (!universitario) {
        const leituraAtividadesAlternativas = await lerAtividadesAlternativas(situacao, db, session, { key: key, value: value });
        if (!leituraAtividadesAlternativas.success) {
            return leituraAtividadesAlternativas;
        }
        atividades = [...atividades, ...leituraAtividadesAlternativas.data];
    }
    if (!aluno) {
        const leituraAtividadesBancoDeQuestoes = await lerAtividadesBancoDeQuestoes(situacao, db, session, { key: key, value: value });
        if (!leituraAtividadesBancoDeQuestoes.success) {
            return leituraAtividadesBancoDeQuestoes;
        }
        atividades = [...atividades, ...leituraAtividadesBancoDeQuestoes.data];
    }
    const leituraAtividadesDisserativas = await lerAtividadesDissertativas(situacao, universitario, db, session, {
        key: key,
        value: value,
    });
    if (!leituraAtividadesDisserativas.success) {
        return leituraAtividadesDisserativas;
    }
    atividades = [...atividades, ...leituraAtividadesDisserativas.data];
    return {
        success: true,
        data: atividades,
    };
};
const removerAtividade = async (id, db, session) => {
    const campoId = 'id';
    return Database_1.default.remove(exports.collection, [{ key: campoId, value: id }], db, session);
};
exports.default = {
    addAtividadeAlternativa,
    addAtividadeDissertativa,
    addAtividadeBancoDeQuestoes,
    lerAtividade,
    lerAtividadesEspecificas,
    removerAtividade,
};
//# sourceMappingURL=RepositorioAtividade.js.map