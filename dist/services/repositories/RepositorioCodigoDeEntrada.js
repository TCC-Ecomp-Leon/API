"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const Database_1 = __importDefault(require("../data/Database"));
const collection = 'CodigoDeEntrada';
const addCodigoDeEntrada = async (idProjeto, informacoes, db, session) => {
    const codigo = {
        id: uuid_1.v4(),
        idProjeto: idProjeto,
        geradoEm: new Date(),
        usado: false,
        ...informacoes,
    };
    const addResult = await Database_1.default.addData(collection, codigo, db, session);
    if (!addResult.success)
        return addResult;
    return {
        success: true,
        data: codigo,
    };
};
const readCodigoDeEntrada = (id, db, session) => {
    return Database_1.default.readData(collection, [{ key: 'id', value: id }], db, session);
};
const readCodigosDeEntrada = (idProjeto, idCurso, idMateria, tipo, db, session) => {
    const searchFields = [];
    if (idProjeto !== undefined) {
        searchFields.push({
            key: 'idProjeto',
            value: idProjeto,
        });
    }
    if (idCurso !== undefined) {
        searchFields.push({
            key: 'idCurso',
            value: idCurso,
        });
    }
    if (idMateria !== undefined) {
        searchFields.push({
            key: 'idMateria',
            value: idMateria,
        });
    }
    if (tipo !== undefined) {
        searchFields.push({
            key: 'tipo',
            value: tipo,
        });
    }
    return Database_1.default.readDatas(collection, searchFields, db, session);
};
const usarCodigoDeEntrada = (id, idPerfil, db, session) => {
    return Database_1.default.updatePartialData(collection, [{ key: 'id', value: id }], { usado: true, usadoEm: new Date(), idPerfilUsou: idPerfil }, db, session);
};
const removerCodigoDeEntrada = (id, db, session) => {
    return Database_1.default.remove(collection, [{ key: 'id', value: id }], db, session);
};
exports.default = {
    addCodigoDeEntrada,
    readCodigoDeEntrada,
    readCodigosDeEntrada,
    usarCodigoDeEntrada,
    removerCodigoDeEntrada,
};
//# sourceMappingURL=RepositorioCodigoDeEntrada.js.map