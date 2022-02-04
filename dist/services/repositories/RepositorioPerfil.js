"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const Database_1 = __importDefault(require("../data/Database"));
const RepositorioProjeto_1 = __importDefault(require("./RepositorioProjeto"));
const RepositorioCodigoDeEntrada_1 = __importDefault(require("./RepositorioCodigoDeEntrada"));
const RepositorioUniversitario_1 = __importDefault(require("./RepositorioUniversitario"));
const images_1 = __importDefault(require("../../assets/images"));
const environmentVariables_1 = __importDefault(require("../../config/environmentVariables"));
const collection = 'Perfil';
const addAdministrador = (
/**
 * Mesmo identificador do serviço de login
 */
id, email, nome, telefone, db, session) => {
    const perfil = {
        id: id,
        nome: nome,
        email: email,
        telefone: telefone,
        entradaEm: new Date(),
        fotoPerfil: defaultProfileImage,
        regra: models_1.RegraPerfil.Administrador,
    };
    return Database_1.default.addData(collection, perfil, db, session);
};
const addPerfilProjeto = async (
/**
 * Mesmo identificador do serviço de login
 */
id, emailProjeto, db, session) => {
    const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(emailProjeto, db, session);
    if (!readProjeto.success)
        return readProjeto;
    const aprovarProjeto = await RepositorioProjeto_1.default.aprovarProjeto(emailProjeto, id, db, session);
    if (!aprovarProjeto.success)
        return aprovarProjeto;
    const projeto = readProjeto.data;
    const perfil = {
        id: id,
        email: emailProjeto,
        nome: projeto.nome,
        telefone: projeto.telefone,
        entradaEm: new Date(),
        fotoPerfil: defaultProfileImage,
        regra: models_1.RegraPerfil.Projeto,
    };
    const addPerfil = await Database_1.default.addData(collection, perfil, db, session);
    return addPerfil;
};
/**
 * Um perfil geral, só entra no sistema com um código de acesso, logo aqui terá que
 * ser consumido esse código e atrelado ao usuário sua regra de acordo com isso.
 */
const addPerfilGeral = async (
/**
 * Mesmo identificador do serviço de login
 */
id, email, nome, telefone, idCodigoDeEntrada, db, session) => {
    if (idCodigoDeEntrada !== undefined) {
        const readCodigoDeEntrada = await RepositorioCodigoDeEntrada_1.default.readCodigoDeEntrada(idCodigoDeEntrada, db, session);
        if (!readCodigoDeEntrada.success)
            return readCodigoDeEntrada;
        const codigoDeEntrada = readCodigoDeEntrada.data;
        if (codigoDeEntrada.usado) {
            return {
                success: true,
                data: false,
            };
        }
        //Necessário consumir o código e realizar o processo de atribuíção do novo usuário
        //como professor ou aluno de acordo com as informações do código de entrada.
        if (codigoDeEntrada.tipo === models_1.TipoCodigoDeEntrada.Aluno) {
            const addAluno = await RepositorioProjeto_1.default.adicionarAlunoAoCurso(codigoDeEntrada.idProjeto, codigoDeEntrada.idCurso, id, db, session);
            if (!addAluno.success)
                return addAluno;
        }
        else if (codigoDeEntrada.tipo === models_1.TipoCodigoDeEntrada.Professor) {
            const addProfessor = await RepositorioProjeto_1.default.atribuirProfessorAMateria(codigoDeEntrada.idProjeto, codigoDeEntrada.idCurso, codigoDeEntrada.idMateria, id, db, session);
            if (!addProfessor.success)
                return addProfessor;
        }
    }
    const profile = {
        id: id,
        email: email,
        nome: nome,
        telefone: telefone,
        entradaEm: new Date(),
        fotoPerfil: defaultProfileImage,
        regra: models_1.RegraPerfil.Geral,
    };
    const addProfile = await Database_1.default.addData(collection, profile, db, session);
    if (!addProfile.success) {
        return addProfile;
    }
    return {
        success: true,
        data: true,
    };
};
const readPerfil = async (id, email, _emailValidado, db, session) => {
    const env = environmentVariables_1.default().ENV;
    const emailValidado = env === 'BETA' || env === 'LOCAL' || _emailValidado;
    const identificadorPerfil = 'id';
    const readPerfil = await Database_1.default.readData(collection, [{ key: identificadorPerfil, value: id }], db, session);
    let perfil;
    if (!readPerfil.success)
        return readPerfil;
    const regraPerfil = readPerfil.data.regra;
    if (regraPerfil === models_1.RegraPerfil.Geral) {
        const readCursosAluno = await RepositorioProjeto_1.default.readCursosAluno(readPerfil.data.id, db, session);
        if (!readCursosAluno.success)
            return readCursosAluno;
        const readMateriasProfessor = await RepositorioProjeto_1.default.readMateriasProfessor(readPerfil.data.id, db, session);
        if (!readMateriasProfessor.success)
            return readMateriasProfessor;
        const informacoesUniversitario = await RepositorioUniversitario_1.default.readInformacoesUniversitario(email, emailValidado, db, session);
        if (!informacoesUniversitario.success)
            return informacoesUniversitario;
        perfil = {
            ...readPerfil.data,
            associacoes: {
                aluno: readCursosAluno.data.length > 0
                    ? {
                        alunoParceiro: true,
                        cursos: readCursosAluno.data,
                    }
                    : { alunoParceiro: false },
                professor: readMateriasProfessor.data.length > 0
                    ? {
                        professor: true,
                        materiasProfessor: readMateriasProfessor.data,
                    }
                    : {
                        professor: false,
                    },
            },
            universitario: informacoesUniversitario.data,
            cpf: readPerfil.data.cpf,
        };
    }
    else {
        perfil = {
            ...readPerfil.data,
            regra: regraPerfil,
        };
    }
    return {
        success: true,
        data: perfil,
    };
};
const atualizarPerfil = (idPerfil, info, db, session) => {
    const identificadorPerfil = 'id';
    return Database_1.default.updatePartialData(collection, [{ key: identificadorPerfil, value: idPerfil }], info, db, session);
};
const deletarPerfil = (idPerfil, db, session) => {
    const identificadorPerfil = 'id';
    return Database_1.default.remove(collection, [{ key: identificadorPerfil, value: idPerfil }], db, session);
};
exports.default = {
    addAdministrador,
    addPerfilProjeto,
    addPerfilGeral,
    readPerfil,
    atualizarPerfil,
    deletarPerfil,
};
const defaultProfileImage = images_1.default.imgPerfil;
//# sourceMappingURL=RepositorioPerfil.js.map