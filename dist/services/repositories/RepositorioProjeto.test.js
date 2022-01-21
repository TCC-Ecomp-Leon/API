"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RepositorioProjeto_1 = __importDefault(require("./RepositorioProjeto"));
const uuid_1 = require("uuid");
const database_1 = require("../../config/database");
jest.setTimeout(10000);
test('Criação e leitura de um projeto', async () => {
    const nomeProjeto = 'Projeto test';
    const emailProjeto = 'projeto@test.com';
    const descricaoProjeto = 'Teste';
    const telefoneProjeto = 12999999999;
    const enderecoProjeto = {
        rua: 'Rua Teste',
        numero: 0,
        bairro: 'Bairro Teste',
        cidade: 'Cidade Teste',
        estado: 'SP',
        cep: 12332000,
        localizacao: {
            lat: 0,
            lng: 0,
        },
    };
    const service = async (db, session) => {
        const addProjeto = await RepositorioProjeto_1.default.adicionarProjeto(nomeProjeto, descricaoProjeto, emailProjeto, telefoneProjeto, enderecoProjeto, db, session);
        expect(addProjeto.success).toBe(true);
        if (!addProjeto.success)
            throw addProjeto.error;
        const readProjeto = await RepositorioProjeto_1.default.readProjeto(addProjeto.data, db, session);
        expect(readProjeto.success).toBe(true);
        if (!readProjeto.success)
            throw readProjeto.error;
        const projeto = readProjeto.data;
        expect(projeto.nome).toBe(nomeProjeto);
        expect(projeto.descricao).toBe(descricaoProjeto);
        expect(projeto.email).toBe(emailProjeto);
        expect(projeto.telefone).toBe(telefoneProjeto);
        expect(projeto.endereco).toStrictEqual(enderecoProjeto);
        expect(projeto.aprovado).toBe(false);
        const readProjetoPorEmail = await RepositorioProjeto_1.default.readProjetoPorEmail(emailProjeto, db, session);
        expect(readProjetoPorEmail).toStrictEqual({
            success: true,
            data: projeto,
        });
        const readCursosProjeto = await RepositorioProjeto_1.default.readCursosProjeto(projeto.id, db, session);
        expect(readCursosProjeto).toStrictEqual({
            success: true,
            data: [],
        });
    };
    await database_1.withDatabaseTransaction(service, undefined, true);
});
test('Criação, aprovação e adição de curso em um projeto', async () => {
    const nomeProjeto = 'Projeto test';
    const emailProjeto = 'projeto@test.com';
    const descricaoProjeto = 'Teste';
    const telefoneProjeto = 12999999999;
    const enderecoProjeto = {
        rua: 'Rua Teste',
        numero: 0,
        bairro: 'Bairro Teste',
        cidade: 'Cidade Teste',
        estado: 'SP',
        cep: 12332000,
        localizacao: {
            lat: 0,
            lng: 0,
        },
    };
    const idPerfilResponsavel = uuid_1.v4();
    const idCursoSemAlunos = uuid_1.v4();
    const materiaSemAlunos = {
        id: uuid_1.v4(),
        nome: 'Curso Test',
        descricao: 'Teste',
        idCurso: idCursoSemAlunos,
    };
    const cursoSemAlunos = {
        id: idCursoSemAlunos,
        idProjeto: uuid_1.v4(),
        nome: 'Curso Test',
        descricao: 'Teste',
        inicioCurso: new Date(),
        fimCurso: new Date(),
        atualizadoEm: new Date(),
        turma: [],
        materias: [materiaSemAlunos],
    };
    const service = async (db, session) => {
        const addProjeto = await RepositorioProjeto_1.default.adicionarProjeto(nomeProjeto, descricaoProjeto, emailProjeto, telefoneProjeto, enderecoProjeto, db, session);
        expect(addProjeto.success).toBe(true);
        if (!addProjeto.success)
            throw addProjeto.error;
        const resultadoAprovacao = await RepositorioProjeto_1.default.aprovarProjeto(emailProjeto, idPerfilResponsavel, db, session);
        expect(resultadoAprovacao.success).toBe(true);
        const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(emailProjeto, db, session);
        expect(readProjeto.success).toBe(true);
        if (!readProjeto.success)
            throw readProjeto.error;
        const projeto = readProjeto.data;
        expect(projeto.nome).toBe(nomeProjeto);
        expect(projeto.descricao).toBe(descricaoProjeto);
        expect(projeto.email).toBe(emailProjeto);
        expect(projeto.telefone).toBe(telefoneProjeto);
        expect(projeto.endereco).toStrictEqual(enderecoProjeto);
        expect(projeto.aprovado).toBe(true);
        if (!projeto.aprovado)
            return;
        expect(projeto.idPerfilResponsavel).toBe(idPerfilResponsavel);
        expect(projeto.cursos).toStrictEqual([]);
        const addCurso = await RepositorioProjeto_1.default.adicionarCurso(projeto.id, cursoSemAlunos, db, session);
        expect(addCurso.success).toBe(true);
        const cursos = await RepositorioProjeto_1.default.readCursosProjeto(projeto.id, db, session);
        if (!cursos.success)
            throw cursos.error;
        expect(cursos).toStrictEqual({
            success: true,
            data: [cursoSemAlunos],
        });
    };
    await database_1.withDatabaseTransaction(service, undefined, true);
});
test('Leitura de cursos que um aluno participa', async () => {
    const nomeProjeto = 'Projeto test';
    const emailProjeto = 'projeto@test.com';
    const descricaoProjeto = 'Teste';
    const telefoneProjeto = 12999999999;
    const enderecoProjeto = {
        rua: 'Rua Teste',
        numero: 0,
        bairro: 'Bairro Teste',
        cidade: 'Cidade Teste',
        estado: 'SP',
        cep: 12332000,
        localizacao: {
            lat: 0,
            lng: 0,
        },
    };
    const idPerfilResponsavel = uuid_1.v4();
    const idCursoComAlunos = uuid_1.v4();
    const materiaSemAlunos = {
        id: uuid_1.v4(),
        nome: 'Curso Test',
        descricao: 'Teste',
        idCurso: idCursoComAlunos,
    };
    const cursoComAlunos = {
        id: idCursoComAlunos,
        idProjeto: uuid_1.v4(),
        nome: 'Curso Test',
        descricao: 'Teste',
        inicioCurso: new Date(),
        fimCurso: new Date(),
        atualizadoEm: new Date(),
        turma: [uuid_1.v4(), uuid_1.v4(), uuid_1.v4()],
        materias: [materiaSemAlunos],
    };
    const service = async (db, session) => {
        const addProjeto = await RepositorioProjeto_1.default.adicionarProjeto(nomeProjeto, descricaoProjeto, emailProjeto, telefoneProjeto, enderecoProjeto, db, session);
        expect(addProjeto.success).toBe(true);
        if (!addProjeto.success)
            throw addProjeto.error;
        const resultadoAprovacao = await RepositorioProjeto_1.default.aprovarProjeto(emailProjeto, idPerfilResponsavel, db, session);
        expect(resultadoAprovacao.success).toBe(true);
        const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(emailProjeto, db, session);
        expect(readProjeto.success).toBe(true);
        if (!readProjeto.success)
            throw readProjeto.error;
        const projeto = readProjeto.data;
        if (!projeto.aprovado)
            return;
        const addCurso = await RepositorioProjeto_1.default.adicionarCurso(projeto.id, cursoComAlunos, db, session);
        expect(addCurso.success).toBe(true);
        for (let i = 0; i < cursoComAlunos.turma.length; i++) {
            const cursos = await RepositorioProjeto_1.default.readCursosAluno(cursoComAlunos.turma[i], db, session);
            expect(cursos).toStrictEqual({
                success: true,
                data: [cursoComAlunos],
            });
        }
    };
    await database_1.withDatabaseTransaction(service, undefined, true);
});
test('Adição de alunos em um curso', async () => {
    const nomeProjeto = 'Projeto test';
    const emailProjeto = 'projeto@test.com';
    const descricaoProjeto = 'Teste';
    const telefoneProjeto = 12999999999;
    const enderecoProjeto = {
        rua: 'Rua Teste',
        numero: 0,
        bairro: 'Bairro Teste',
        cidade: 'Cidade Teste',
        estado: 'SP',
        cep: 12332000,
        localizacao: {
            lat: 0,
            lng: 0,
        },
    };
    const idPerfilResponsavel = uuid_1.v4();
    const idCursoSemAlunos = uuid_1.v4();
    const materiaSemAlunos = {
        id: uuid_1.v4(),
        nome: 'Curso Test',
        descricao: 'Teste',
        idCurso: idCursoSemAlunos,
    };
    const service = async (db, session) => {
        const addProjeto = await RepositorioProjeto_1.default.adicionarProjeto(nomeProjeto, descricaoProjeto, emailProjeto, telefoneProjeto, enderecoProjeto, db, session);
        expect(addProjeto.success).toBe(true);
        if (!addProjeto.success)
            throw addProjeto.error;
        const cursoSemAlunos = {
            id: idCursoSemAlunos,
            idProjeto: addProjeto.data,
            nome: 'Curso Test',
            descricao: 'Teste',
            inicioCurso: new Date(),
            fimCurso: new Date(),
            atualizadoEm: new Date(),
            turma: [],
            materias: [materiaSemAlunos],
        };
        const resultadoAprovacao = await RepositorioProjeto_1.default.aprovarProjeto(emailProjeto, idPerfilResponsavel, db, session);
        expect(resultadoAprovacao.success).toBe(true);
        const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(emailProjeto, db, session);
        expect(readProjeto.success).toBe(true);
        if (!readProjeto.success)
            throw readProjeto.error;
        const projeto = readProjeto.data;
        expect(projeto.nome).toBe(nomeProjeto);
        expect(projeto.descricao).toBe(descricaoProjeto);
        expect(projeto.email).toBe(emailProjeto);
        expect(projeto.telefone).toBe(telefoneProjeto);
        expect(projeto.endereco).toStrictEqual(enderecoProjeto);
        expect(projeto.aprovado).toBe(true);
        if (!projeto.aprovado)
            return;
        expect(projeto.idPerfilResponsavel).toBe(idPerfilResponsavel);
        expect(projeto.cursos).toStrictEqual([]);
        const addCurso = await RepositorioProjeto_1.default.adicionarCurso(projeto.id, cursoSemAlunos, db, session);
        expect(addCurso.success).toBe(true);
        const alunosParaAdicionar = [uuid_1.v4(), uuid_1.v4(), uuid_1.v4()];
        for (let i = 0; i < alunosParaAdicionar.length; i++) {
            const result = await RepositorioProjeto_1.default.adicionarAlunoAoCurso(projeto.id, cursoSemAlunos.id, alunosParaAdicionar[i], db, session);
            expect(result.success).toBe(true);
        }
        const cursos = await RepositorioProjeto_1.default.readCursosProjeto(projeto.id, db, session);
        if (!cursos.success)
            throw cursos.error;
        expect(cursos).toStrictEqual({
            success: true,
            data: [{ ...cursoSemAlunos, turma: alunosParaAdicionar }],
        });
    };
    await database_1.withDatabaseTransaction(service, undefined, true);
});
test('Atribuição de professor à matéria', async () => {
    const nomeProjeto = 'Projeto test';
    const emailProjeto = 'projeto@test.com';
    const descricaoProjeto = 'Teste';
    const telefoneProjeto = 12999999999;
    const enderecoProjeto = {
        rua: 'Rua Teste',
        numero: 0,
        bairro: 'Bairro Teste',
        cidade: 'Cidade Teste',
        estado: 'SP',
        cep: 12332000,
        localizacao: {
            lat: 0,
            lng: 0,
        },
    };
    const idPerfilResponsavel = uuid_1.v4();
    const idCursoSemAlunos = uuid_1.v4();
    const materiaSemAlunos = {
        id: uuid_1.v4(),
        nome: 'Curso Test',
        descricao: 'Teste',
        idCurso: idCursoSemAlunos,
    };
    const service = async (db, session) => {
        const addProjeto = await RepositorioProjeto_1.default.adicionarProjeto(nomeProjeto, descricaoProjeto, emailProjeto, telefoneProjeto, enderecoProjeto, db, session);
        expect(addProjeto.success).toBe(true);
        if (!addProjeto.success)
            throw addProjeto.error;
        const cursoSemAlunos = {
            id: idCursoSemAlunos,
            idProjeto: addProjeto.data,
            nome: 'Curso Test',
            descricao: 'Teste',
            inicioCurso: new Date(),
            fimCurso: new Date(),
            atualizadoEm: new Date(),
            turma: [],
            materias: [materiaSemAlunos],
        };
        const resultadoAprovacao = await RepositorioProjeto_1.default.aprovarProjeto(emailProjeto, idPerfilResponsavel, db, session);
        expect(resultadoAprovacao.success).toBe(true);
        const readProjeto = await RepositorioProjeto_1.default.readProjetoPorEmail(emailProjeto, db, session);
        expect(readProjeto.success).toBe(true);
        if (!readProjeto.success)
            throw readProjeto.error;
        const projeto = readProjeto.data;
        const addCurso = await RepositorioProjeto_1.default.adicionarCurso(projeto.id, cursoSemAlunos, db, session);
        expect(addCurso.success).toBe(true);
        const idProfessor = uuid_1.v4();
        const atribuirProfessorAMateria = await RepositorioProjeto_1.default.atribuirProfessorAMateria(projeto.id, cursoSemAlunos.id, materiaSemAlunos.id, idProfessor, db, session);
        expect(atribuirProfessorAMateria.success).toBe(true);
        const cursos = await RepositorioProjeto_1.default.readCursosProjeto(projeto.id, db, session);
        if (!cursos.success)
            throw cursos.error;
        const listaCursos = cursos.data;
        expect(listaCursos.length).toBe(1);
        expect(listaCursos[0].materias.length).toBe(1);
        expect(listaCursos[0].materias[0].idPerfilProfessor).toBe(idProfessor);
        const readMateriasProfessor = await RepositorioProjeto_1.default.readMateriasProfessor(idProfessor, db, session);
        expect(readMateriasProfessor.success).toBe(true);
        if (!readMateriasProfessor.success)
            throw readMateriasProfessor.error;
        expect(readMateriasProfessor.data.length).toBe(1);
    };
    await database_1.withDatabaseTransaction(service, undefined, true);
});
//# sourceMappingURL=RepositorioProjeto.test.js.map