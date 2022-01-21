"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const Database_1 = __importDefault(require("../data/Database"));
const collection = 'CursoUniversitario';
const addCursoUniversitario = async (curso, db, session) => {
    const _curso = {
        id: uuid_1.v4(),
        ...curso,
        cursoAnterior: curso.cursoAnterior !== null
            ? {
                id: curso.cursoAnterior.id,
            }
            : null,
    };
    const addResult = await Database_1.default.addData(collection, _curso, db, session);
    if (!addResult.success)
        return addResult;
    return {
        success: true,
        data: {
            ..._curso,
            cursoAnterior: curso.cursoAnterior,
        },
    };
};
const readCursoUniversitario = async (id, db, session) => {
    const readCurso = await Database_1.default.readData(collection, [{ key: 'id', value: id }], db, session);
    if (!readCurso.success)
        return readCurso;
    const _curso = readCurso.data;
    if (_curso.cursoAnterior !== null) {
        const readCursoAnterior = await readCursoUniversitario(_curso.cursoAnterior.id, db, session);
        if (!readCursoAnterior.success) {
            return {
                success: true,
                data: {
                    ..._curso,
                    cursoAnterior: null,
                },
            };
        }
        return {
            success: true,
            data: {
                ..._curso,
                cursoAnterior: readCursoAnterior.data,
            },
        };
    }
    return {
        success: true,
        data: {
            ..._curso,
            cursoAnterior: null,
        },
    };
};
const readCursosUniversitarios = async (db, session) => {
    const resultDatabase = await Database_1.default.readDatas(collection, [], db, session);
    if (!resultDatabase.success)
        return resultDatabase;
    const cursosBanco = resultDatabase.data;
    let mapaCursosBanco = {};
    cursosBanco.forEach((curso) => {
        mapaCursosBanco = {
            ...mapaCursosBanco,
            [curso.id]: curso,
        };
    });
    const montarCurso = (curso) => {
        if (curso.cursoAnterior === null)
            return {
                ...curso,
                cursoAnterior: null,
            };
        else {
            const cursoAnterior = mapaCursosBanco[curso.cursoAnterior.id];
            return {
                ...curso,
                cursoAnterior: cursoAnterior !== undefined ? montarCurso(cursoAnterior) : null,
            };
        }
    };
    return {
        success: true,
        data: cursosBanco.map(montarCurso),
    };
};
const updateCursoUniversitario = (id, curso, db, session) => {
    return Database_1.default.updatePartialData(collection, [{ key: 'id', value: id }], {
        ...curso,
        cursoAnterior: curso.cursoAnterior !== undefined
            ? curso.cursoAnterior !== null
                ? {
                    id: curso.cursoAnterior.id,
                }
                : null
            : undefined,
    }, db, session);
};
const deleteCursoUniversitario = (id, db, session) => {
    return Database_1.default.remove(collection, [{ key: 'id', value: id }], db, session);
};
exports.default = {
    addCursoUniversitario,
    readCursoUniversitario,
    readCursosUniversitarios,
    updateCursoUniversitario,
    deleteCursoUniversitario,
};
//# sourceMappingURL=RepositorioCursoUniversitario.js.map