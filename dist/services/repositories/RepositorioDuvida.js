"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const Database_1 = __importDefault(require("../data/Database"));
const collection = 'Duvida';
const adicionarDuvida = async (titulo, descricao, idAluno, idCurso, idMateria, primeiraMensagem, idCursoUniversitario, db, session) => {
    const duvida = {
        id: uuid_1.v4(),
        titulo: titulo,
        descricao: descricao,
        idAluno: idAluno,
        idCursoAluno: idCurso,
        idMateria: idMateria,
        idCursoUniversitario: idCursoUniversitario,
        mensagens: [
            {
                idPerfil: idAluno,
                mensagem: primeiraMensagem,
                horario: new Date(),
            },
        ],
        resolvida: false,
    };
    const result = await Database_1.default.addData(collection, duvida, db, session);
    if (!result.success)
        return result;
    return {
        success: true,
        data: duvida.id,
    };
};
const readDuvida = (id, db, session) => {
    return Database_1.default.readData(collection, [{ key: 'id', value: id }], db, session);
};
const readDuvidas = (db, session) => {
    return Database_1.default.readDatas(collection, [], db, session);
};
const readDuvidasEspecificas = (key, value, db, session) => {
    return Database_1.default.readDatas(collection, [{ key: key, value: value }], db, session);
};
const readDuvidasComMensagensDeUmUsuario = (idPerfil, db, session) => {
    return Database_1.default.readDatas(collection, [{ key: 'mensagens.idPerfil', value: idPerfil }], db, session);
};
const adicionarMensagem = (idDuvida, idPerfil, mensagem, db, session) => {
    const campoMensagem = 'mensagens';
    const mensagemFechar = {
        idPerfil: idPerfil,
        mensagem: mensagem,
        horario: new Date(),
    };
    return Database_1.default.updatePushData(collection, [{ key: 'id', value: idDuvida }], campoMensagem, mensagemFechar, db, session);
};
const fecharDuvida = async (idDuvida, idPerfil, db, session) => {
    const campoMensagem = 'mensagens';
    const mensagemFechar = {
        idPerfil: idPerfil,
        mensagem: 'DÚVIDA FECHADA',
        horario: new Date(),
    };
    const resultMensagemFechar = await Database_1.default.updatePushData(collection, [{ key: 'id', value: idDuvida }], campoMensagem, mensagemFechar, db, session);
    if (!resultMensagemFechar.success)
        return resultMensagemFechar;
    const fecharDuvida = await Database_1.default.updateGenericData(collection, [{ key: 'id', value: idDuvida }], [{ key: 'resolvida', value: true }], db, session);
    return fecharDuvida;
};
exports.default = {
    adicionarDuvida,
    readDuvida,
    readDuvidas,
    readDuvidasEspecificas,
    readDuvidasComMensagensDeUmUsuario,
    adicionarMensagem,
    fecharDuvida,
};
//# sourceMappingURL=RepositorioDuvida.js.map