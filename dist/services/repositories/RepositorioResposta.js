"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const models_1 = require("../../models");
const Database_1 = __importDefault(require("../data/Database"));
const lodash_1 = __importDefault(require("lodash"));
const RepositorioBancoDeQuestoes_1 = __importDefault(require("./RepositorioBancoDeQuestoes"));
const RepositorioAtividade_1 = __importDefault(require("./RepositorioAtividade"));
const collection = 'RespostaAtividade';
const responderAtividadeAlternativa = async (idProjeto, idCurso, idMateria, idAtividade, idAluno, respostas, db, session) => {
    const resposta = {
        id: uuid_1.v4(),
        idProjeto: idProjeto,
        idCurso: idCurso,
        idMateria: idMateria,
        idAtividade: idAtividade,
        tipo: models_1.TipoAtividade.Alternativa,
        respostas: respostas,
        idAluno: idAluno,
        respondidoEm: new Date(),
        encerrada: false,
    };
    const result = await Database_1.default.addData(collection, resposta, db, session);
    if (!result.success)
        return result;
    return {
        success: true,
        data: resposta.id,
    };
};
const responderAtividadeDissertativa = async (idProjeto, idCurso, idMateria, idAtividade, idAluno, respostas, db, session) => {
    const resposta = {
        id: uuid_1.v4(),
        idProjeto: idProjeto,
        idCurso: idCurso,
        idMateria: idMateria,
        idAtividade: idAtividade,
        tipo: models_1.TipoAtividade.Dissertativa,
        respostas: respostas,
        idAluno: idAluno,
        respondidoEm: new Date(),
        corrigida: false,
    };
    const result = await Database_1.default.addData(collection, resposta, db, session);
    if (!result.success)
        return result;
    return {
        success: true,
        data: resposta.id,
    };
};
const responderAtividadeBancoDeQuestoes = async (idProjeto, idCurso, idMateria, idAtividade, idUniversitario, respostas, db, session) => {
    const resposta = {
        id: uuid_1.v4(),
        idProjeto: idProjeto,
        idCurso: idCurso,
        idMateria: idMateria,
        idAtividade: idAtividade,
        tipo: models_1.TipoAtividade.BancoDeQuestoes,
        respostas: respostas,
        idUniversitario: idUniversitario,
        respondidoEm: new Date(),
        avaliada: false,
    };
    const result = await Database_1.default.addData(collection, resposta, db, session);
    if (!result.success)
        return result;
    return {
        success: true,
        data: resposta.id,
    };
};
const completarAtividadeAlternativa = (resposta, atividade) => {
    if (new Date() > atividade.fechamentoRespostas) {
        let somatorio = 0.0;
        let somatorioPesos = 0.0;
        const notaReferencia = atividade.notaReferencia;
        resposta.respostas.forEach((resposta) => {
            const { idQuestao, alternativas } = resposta;
            const questaoConfigurada = atividade.itens.find((questao) => questao.idQuestao === idQuestao);
            if (questaoConfigurada === undefined) {
                throw Error('Não foi possível encontrar a questão respondida na atividade');
            }
            const alternativasConfiguradas = questaoConfigurada.alternativas;
            if (lodash_1.default.isEqual(alternativas.map((alternativa) => alternativa.value), alternativasConfiguradas.map((alternativa) => alternativa.value))) {
                somatorio = somatorio + questaoConfigurada.peso;
            }
            somatorioPesos = somatorioPesos + questaoConfigurada.peso;
        });
        const nota = (somatorio / somatorioPesos) * notaReferencia;
        return {
            ...resposta,
            encerrada: true,
            nota: nota,
        };
    }
    else {
        return {
            ...resposta,
            encerrada: false,
        };
    }
};
const lerResposta = async (id, db, session) => {
    const campoId = 'id';
    const leitura = await Database_1.default.readData(collection, [
        {
            key: campoId,
            value: id,
        },
    ], db, session);
    if (!leitura.success)
        return leitura;
    const dado = leitura.data;
    if (dado.tipo === models_1.TipoAtividade.Alternativa) {
        const leituraAtividade = await RepositorioAtividade_1.default.lerAtividade(dado.idAtividade, db, session);
        if (!leituraAtividade.success)
            return leituraAtividade;
        const atividade = leituraAtividade.data;
        if (atividade.tipoAtividade !== models_1.TipoAtividade.Alternativa) {
            return {
                success: false,
                error: Error('Resposta alternativa de atividade não alternativa'),
            };
        }
        return {
            success: true,
            data: completarAtividadeAlternativa(dado, atividade),
        };
    }
    else {
        return {
            success: true,
            data: dado,
        };
    }
};
const lerRespostas = async (db, session) => {
    const leitura = await Database_1.default.readCollection(collection, db, session);
    if (!leitura.success)
        return leitura;
    const dados = leitura.data;
    const lista = [];
    for (let i = 0; i < dados.length; i++) {
        const dado = dados[i];
        if (dado.tipo === models_1.TipoAtividade.Alternativa) {
            const leituraAtividade = await RepositorioAtividade_1.default.lerAtividade(dado.idAtividade, db, session);
            if (!leituraAtividade.success)
                return leituraAtividade;
            const atividade = leituraAtividade.data;
            if (atividade.tipoAtividade !== models_1.TipoAtividade.Alternativa) {
                return {
                    success: false,
                    error: Error('Resposta alternativa de atividade não alternativa'),
                };
            }
            lista.push(completarAtividadeAlternativa(dado, atividade));
        }
        else {
            lista.push(dado);
        }
    }
    return {
        success: true,
        data: lista,
    };
};
const lerRespostasEspecificas = async (key, value, db, session) => {
    const leitura = await Database_1.default.readDatas(collection, [
        {
            key: key,
            value: value,
        },
    ], db, session);
    if (!leitura.success)
        return leitura;
    const dados = leitura.data;
    const lista = [];
    for (let i = 0; i < dados.length; i++) {
        const dado = dados[i];
        if (dado.tipo === models_1.TipoAtividade.Alternativa) {
            const leituraAtividade = await RepositorioAtividade_1.default.lerAtividade(dado.idAtividade, db, session);
            if (!leituraAtividade.success)
                return leituraAtividade;
            const atividade = leituraAtividade.data;
            if (atividade.tipoAtividade !== models_1.TipoAtividade.Alternativa) {
                return {
                    success: false,
                    error: Error('Resposta alternativa de atividade não alternativa'),
                };
            }
            lista.push(completarAtividadeAlternativa(dado, atividade));
        }
        else {
            lista.push(dado);
        }
    }
    return {
        success: true,
        data: lista,
    };
};
const lerRespostasDeUmAlunoEmUmaAtividade = async (idAtividade, idAluno, db, session) => {
    const campoIdAluno = 'idAluno';
    const campoIdAtividade = 'idAtividade';
    const leitura = await Database_1.default.readDatas(collection, [
        {
            key: campoIdAluno,
            value: idAluno,
        },
        {
            key: campoIdAtividade,
            value: idAtividade,
        },
    ], db, session);
    if (!leitura.success)
        return leitura;
    const dados = leitura.data;
    const lista = [];
    for (let i = 0; i < dados.length; i++) {
        const dado = dados[i];
        if (dado.tipo === models_1.TipoAtividade.Alternativa) {
            const leituraAtividade = await RepositorioAtividade_1.default.lerAtividade(dado.idAtividade, db, session);
            if (!leituraAtividade.success)
                return leituraAtividade;
            const atividade = leituraAtividade.data;
            if (atividade.tipoAtividade !== models_1.TipoAtividade.Alternativa) {
                return {
                    success: false,
                    error: Error('Resposta alternativa de atividade não alternativa'),
                };
            }
            lista.push(completarAtividadeAlternativa(dado, atividade));
        }
        else {
            lista.push(dado);
        }
    }
    return {
        success: true,
        data: lista,
    };
};
const lerRespostasBancoDeQuestoesUniversitario = (idUniversitario, db, session) => {
    const campoTipoAtividade = 'tipo';
    const campoIdUniversitario = 'idUniversitario';
    return Database_1.default.readDatas(collection, [
        {
            key: campoTipoAtividade,
            value: models_1.TipoAtividade.BancoDeQuestoes,
        },
        {
            key: campoIdUniversitario,
            value: idUniversitario,
        },
    ], db, session);
};
const corrigirAtividadeDissertativa = (id, idPerfil, nota, correcaoQuestoes, db, session) => {
    const campoId = 'id';
    const atualizacao = {
        tipo: models_1.TipoAtividade.Dissertativa,
        corrigida: true,
        horarioCorrecao: new Date(),
        idPerfilCorrecao: idPerfil,
        nota: nota,
        correcaoQuestao: correcaoQuestoes,
        revisao: models_1.EstadoRevisao.Nenhum,
    };
    return Database_1.default.updatePartialData(collection, [
        {
            key: campoId,
            value: id,
        },
    ], atualizacao, db, session);
};
const requisitarRevisaoAtividadeDissertativa = (id, db, session) => {
    const campoId = 'id';
    const atualizacao = {
        tipo: models_1.TipoAtividade.Dissertativa,
        revisao: models_1.EstadoRevisao.Requisitada,
        revisaoRequisitadaEm: new Date(),
    };
    return Database_1.default.updatePartialData(collection, [
        {
            key: campoId,
            value: id,
        },
    ], atualizacao, db, session);
};
const finalizarRevisaoAtividadeDissertativa = async (id, nota, correcaoQuestoes, db, session) => {
    const leituraRespostaAnterior = await lerResposta(id, db, session);
    if (!leituraRespostaAnterior.success)
        return leituraRespostaAnterior;
    const respostaAnterior = leituraRespostaAnterior.data;
    if (respostaAnterior.tipo !== models_1.TipoAtividade.Dissertativa) {
        return {
            success: false,
            error: Error('Tentando finalizar a revisão de uma atividade não dissertativa'),
        };
    }
    if (!respostaAnterior.corrigida) {
        return {
            success: false,
            error: Error('Tentando finalizar a revisão de uma atividade ainda não corrigida'),
        };
    }
    const campoId = 'id';
    const atualizacao = {
        tipo: models_1.TipoAtividade.Dissertativa,
        nota: nota,
        revisao: models_1.EstadoRevisao.Finalizada,
        revisaoAtendidaEm: new Date(),
        revisaoQuestoes: correcaoQuestoes,
        notaRevisao: nota,
        notaAnteriorRevisao: respostaAnterior.nota,
    };
    return Database_1.default.updatePartialData(collection, [
        {
            key: campoId,
            value: id,
        },
    ], atualizacao, db, session);
};
const avaliarRespostasBanco = async (id, idPerfil, avaliacoes, db, session) => {
    const campoId = 'id';
    const leituraResposta = await lerResposta(id, db, session);
    if (!leituraResposta.success)
        return leituraResposta;
    let resposta = leituraResposta.data;
    if (resposta.tipo !== models_1.TipoAtividade.BancoDeQuestoes) {
        return {
            success: false,
            error: Error('Tentando avaliar questões de banco de questão que não são desse tipo'),
        };
    }
    const readAtividade = await RepositorioAtividade_1.default.lerAtividade(resposta.idAtividade, db, session);
    if (!readAtividade.success)
        return readAtividade;
    const atividade = readAtividade.data;
    if (atividade.tipoAtividade !== models_1.TipoAtividade.BancoDeQuestoes) {
        return {
            success: false,
            error: Error('Avaliação de resposta de banco de questẽos de atividade que não é desse tipo'),
        };
    }
    const questoesBanco = [];
    avaliacoes.avaliacaoQuestoes.forEach((avaliacaoQuestao) => {
        const { idQuestao, aprovada } = avaliacaoQuestao;
        if (aprovada) {
            const respostas = resposta.respostas;
            const questao = respostas.find((resposta) => resposta.idQuestao === idQuestao);
            if (questao !== undefined) {
                questoesBanco.push(questao);
            }
        }
    });
    resposta = {
        ...resposta,
        avaliada: true,
        avaliadaEm: new Date(),
        avaliadaPor: idPerfil,
        ...avaliacoes,
    };
    const atualizacaoResposta = await Database_1.default.updatePartialData(collection, [{ key: campoId, value: id }], resposta, db, session);
    if (!atualizacaoResposta.success)
        return atualizacaoResposta;
    for (let i = 0; i < questoesBanco.length; i++) {
        const questao = questoesBanco[i];
        const add = await RepositorioBancoDeQuestoes_1.default.adicionarQuestao(atividade, questao, db, session);
        if (!add.success)
            return add;
    }
    return {
        success: true,
        data: null,
    };
};
exports.default = {
    responderAtividadeAlternativa,
    responderAtividadeDissertativa,
    responderAtividadeBancoDeQuestoes,
    lerResposta,
    lerRespostas,
    lerRespostasEspecificas,
    corrigirAtividadeDissertativa,
    requisitarRevisaoAtividadeDissertativa,
    finalizarRevisaoAtividadeDissertativa,
    avaliarRespostasBanco,
    lerRespostasDeUmAlunoEmUmaAtividade,
    lerRespostasBancoDeQuestoesUniversitario,
};
//# sourceMappingURL=RepositorioResposta.js.map