"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const Database_1 = __importDefault(require("../data/Database"));
const collection = 'Projeto';
const readProjeto = (id, db, session) => {
    const identificadorProjeto = 'id';
    return Database_1.default.readData(collection, [{ key: identificadorProjeto, value: id }], db, session);
};
const readProjetos = (aprovado, db, session) => {
    const searchParameters = [];
    if (aprovado !== undefined) {
        const campoAprovacao = 'aprovado';
        searchParameters.push({
            key: campoAprovacao,
            value: aprovado,
        });
    }
    return Database_1.default.readDatas(collection, searchParameters, db, session);
};
const readProjetoPorEmail = (email, db, session) => {
    const identificadorProjeto = 'email';
    return Database_1.default.readData(collection, [{ key: identificadorProjeto, value: email }], db, session);
};
const readCursosProjeto = async (idProjeto, db, session) => {
    const cursos = await Database_1.default.readDatas(collection, [
        {
            key: 'id',
            value: idProjeto,
        },
    ], db, session, ['cursos']);
    if (!cursos.success)
        return cursos;
    return {
        success: true,
        data: cursos.data.length > 0 ? cursos.data[0].cursos : [],
    };
};
const readCursosAluno = async (idAluno, db, session) => {
    const cursos = await Database_1.default.readDatas(collection, [
        {
            key: 'cursos.turma',
            value: idAluno,
        },
    ], db, session, ['cursos']);
    if (!cursos.success)
        return cursos;
    const listaDeCursos = cursos.data.length > 0
        ? Array.prototype.concat.apply([], cursos.data.map((curso) => curso.cursos))
        : [];
    return {
        success: true,
        data: listaDeCursos.filter((curso) => curso.turma.includes(idAluno)),
    };
};
const readMateriasProfessor = async (idProfessor, db, session) => {
    const cursos = await Database_1.default.readDatas(collection, [
        {
            key: 'cursos.materias.idPerfilProfessor',
            value: idProfessor,
        },
    ], db, session, ['cursos.materias']);
    if (!cursos.success)
        return cursos;
    const materias = [];
    cursos.data.forEach((projetoCursos) => {
        projetoCursos.cursos.forEach((curso) => {
            curso.materias.forEach((materia) => {
                materias.push(materia);
            });
        });
    });
    return {
        success: true,
        data: materias.filter((materia) => materia.idPerfilProfessor === idProfessor),
    };
};
const adicionarProjeto = async (nome, descricao, email, telefone, imgProjeto, endereco, db, session) => {
    const projeto = {
        id: uuid_1.v4(),
        nome: nome,
        descricao: descricao,
        email: email,
        telefone: telefone,
        requisicaoEntradaEm: new Date(),
        endereco: endereco,
        aprovado: false,
        imgProjeto: imgProjeto,
    };
    const result = await Database_1.default.addData(collection, projeto, db, session);
    if (!result.success)
        return result;
    return {
        success: true,
        data: projeto.id,
    };
};
const aprovarProjeto = (emailProjeto, idPerfilResponsavel, db, session) => {
    const identificadorProjeto = 'email';
    const projetoParcial = {
        aprovado: true,
        idPerfilResponsavel: idPerfilResponsavel,
        entradaEm: new Date(),
        cursos: [],
    };
    return Database_1.default.updatePartialData(collection, [
        {
            key: identificadorProjeto,
            value: emailProjeto,
        },
    ], projetoParcial, db, session);
};
const adicionarCurso = (idProjeto, curso, db, session) => {
    const identificadorProjeto = 'id';
    return Database_1.default.updatePushData(collection, [{ key: identificadorProjeto, value: idProjeto }], 'cursos', {
        ...curso,
        id: uuid_1.v4(),
        atualizadoEm: new Date(),
        idProjeto: idProjeto,
        turma: [],
    }, db, session);
};
const adicionarMateria = async (idProjeto, idCurso, materia, db, session) => {
    const leituraCursos = await readCursosProjeto(idProjeto, db, session);
    if (!leituraCursos.success) {
        return leituraCursos;
    }
    const cursos = leituraCursos.data;
    const indexCurso = cursos.map((curso) => curso.id).indexOf(idCurso);
    if (indexCurso < 0) {
        return {
            success: false,
            error: Error('Curso não encontrado'),
        };
    }
    const _materia = {
        ...materia,
        id: uuid_1.v4(),
        idCurso: idCurso,
    };
    const materias = [...cursos[indexCurso].materias, _materia];
    return await atualizarCurso(idProjeto, idCurso, { materias: materias }, db, session);
};
const adicionarAlunoAoCurso = (idProjeto, idCurso, idAluno, db, session) => {
    const identificadorProjeto = 'id';
    const identificadorCurso = 'cursos.id';
    return Database_1.default.updatePushData(collection, [
        { key: identificadorProjeto, value: idProjeto },
        { key: identificadorCurso, value: idCurso },
    ], 'cursos.$.turma', idAluno, db, session);
};
const atribuirProfessorAMateria = (idProjeto, idCurso, idMateria, idProfessor, db, session) => {
    const identificadorProjeto = 'id';
    const identificadorCurso = 'cursos.id';
    const identificadorMateria = 'cursos.materias.id';
    const identificadorProfessorMateria = 'cursos.$[].materias.$[].idPerfilProfessor';
    return Database_1.default.updateGenericData(collection, [
        { key: identificadorProjeto, value: idProjeto },
        { key: identificadorCurso, value: idCurso },
        { key: identificadorMateria, value: idMateria },
    ], [{ key: identificadorProfessorMateria, value: idProfessor }], db, session);
};
const removerProjetoPorEmail = (email, db, session) => {
    const campoEmail = 'email';
    return Database_1.default.remove(collection, [
        {
            key: campoEmail,
            value: email,
        },
    ], db, session);
};
const atualizarProjeto = (idProjeto, informacoes, db, session) => {
    const campoId = 'id';
    return Database_1.default.updatePartialData(collection, [{ key: campoId, value: idProjeto }], informacoes, db, session);
};
const atualizarCurso = (idProjeto, idCurso, curso, db, session) => {
    const identificadorProjeto = 'id';
    const identificadorCurso = 'cursos.id';
    return Database_1.default.updateNestedPartialData(collection, [
        { key: identificadorProjeto, value: idProjeto },
        { key: identificadorCurso, value: idCurso },
    ], 'cursos.$', { ...curso, atualizadoEm: new Date() }, db, session);
};
exports.default = {
    readProjeto,
    readProjetos,
    readProjetoPorEmail,
    readCursosProjeto,
    readCursosAluno,
    readMateriasProfessor,
    adicionarProjeto,
    aprovarProjeto,
    adicionarCurso,
    adicionarMateria,
    adicionarAlunoAoCurso,
    atribuirProfessorAMateria,
    removerProjetoPorEmail,
    atualizarProjeto,
    atualizarCurso,
};
//# sourceMappingURL=RepositorioProjeto.js.map