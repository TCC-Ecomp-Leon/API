"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const Database_1 = __importDefault(require("../data/Database"));
const collection = 'BancoDeQuestoes';
const adicionarQuestao = async (atividade, questao, db, session) => {
    const banco = {
        id: uuid_1.v4(),
        criadoEm: new Date(),
        idProjeto: atividade.idProjeto,
        idCurso: atividade.idCurso,
        idMateria: atividade.idMateria,
        questao: questao,
        assuntos: atividade.assuntos,
    };
    const add = await Database_1.default.addData(collection, banco, db, session);
    if (!add.success)
        return add;
    return {
        success: true,
        data: banco.id,
    };
};
const lerQuestoes = (idCurso, idMateria, db, session) => {
    const campoCurso = 'idCurso';
    const campoMateria = 'idMateria';
    const searchParams = [
        { key: campoCurso, value: idCurso },
    ];
    if (idMateria !== undefined) {
        searchParams.push({ key: campoMateria, value: idMateria });
    }
    return Database_1.default.readDatas(collection, searchParams, db, session);
};
const lerQuestao = (id, db, session) => {
    const campoId = 'id';
    return Database_1.default.readData(collection, [
        {
            key: campoId,
            value: id,
        },
    ], db, session);
};
const removerQuestao = (id, db, session) => {
    return Database_1.default.remove(collection, [{ key: 'id', value: id }], db, session);
};
const atualizarQuestao = (id, questao, db, session) => {
    return Database_1.default.updatePartialData(collection, [{ key: 'id', value: id }], { questao: questao }, db, session);
};
const lerQuestoesComFiltro = (filtros, db, session) => {
    return Database_1.default.readDatas(collection, filtros, db, session);
};
exports.default = {
    adicionarQuestao,
    lerQuestao,
    lerQuestoes,
    atualizarQuestao,
    removerQuestao,
    lerQuestoesComFiltro,
};
//# sourceMappingURL=RepositorioBancoDeQuestoes.js.map