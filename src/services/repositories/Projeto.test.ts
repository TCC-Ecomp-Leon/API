import RepositorioProjeto from './RepositorioProjeto';
import { Projeto, Curso, Materia, Endereco } from 'tcc-models';
import { v4 as uuid } from 'uuid';
import {
  DatabaseService,
  withDatabaseTransaction,
} from '../../config/database';

test('Criação e leitura de um projeto', async () => {
  const nomeProjeto = 'Projeto test';
  const emailProjeto = 'projeto@test.com';
  const descricaoProjeto = 'Teste';
  const telefoneProjeto = 12999999999;
  const enderecoProjeto: Endereco = {
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

  const service: DatabaseService<void> = async (db, session) => {
    const addProjeto = await RepositorioProjeto.adicionarProjeto(
      nomeProjeto,
      descricaoProjeto,
      emailProjeto,
      telefoneProjeto,
      enderecoProjeto,
      db,
      session
    );

    expect(addProjeto.success).toBe(true);

    if (!addProjeto.success) throw addProjeto.error;

    const readProjeto = await RepositorioProjeto.readProjeto(
      addProjeto.data,
      db,
      session
    );
    expect(readProjeto.success).toBe(true);

    if (!readProjeto.success) throw readProjeto.error;

    const projeto = readProjeto.data;
    expect(projeto.nome).toBe(nomeProjeto);
    expect(projeto.descricao).toBe(descricaoProjeto);
    expect(projeto.email).toBe(emailProjeto);
    expect(projeto.telefone).toBe(telefoneProjeto);
    expect(projeto.endereco).toStrictEqual(enderecoProjeto);
    expect(projeto.aprovado).toBe(false);

    const readProjetoPorEmail = await RepositorioProjeto.readProjetoPorEmail(
      emailProjeto,
      db,
      session
    );
    expect(readProjetoPorEmail).toStrictEqual({
      success: true,
      data: projeto,
    });

    const readCursosProjeto = await RepositorioProjeto.readCursosProjeto(
      projeto.id,
      db,
      session
    );
    expect(readCursosProjeto).toStrictEqual({
      success: true,
      data: [],
    });
  };

  await withDatabaseTransaction(service, undefined, true);
});

test('Criação, aprovação e adição de curso em um projeto', async () => {
  const nomeProjeto = 'Projeto test';
  const emailProjeto = 'projeto@test.com';
  const descricaoProjeto = 'Teste';
  const telefoneProjeto = 12999999999;
  const enderecoProjeto: Endereco = {
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
  const idPerfilResponsavel = uuid();

  const idCursoSemAlunos = uuid();

  const materiaSemAlunos: Materia = {
    id: uuid(),
    nome: 'Curso Test',
    descricao: 'Teste',
    idCurso: idCursoSemAlunos,
  };

  const cursoSemAlunos: Curso = {
    id: idCursoSemAlunos,
    nome: 'Curso Test',
    descricao: 'Teste',
    inicioCurso: new Date(),
    fimCurso: new Date(),
    atualizadoEm: new Date(),
    turma: [],
    materias: [materiaSemAlunos],
  };

  const service: DatabaseService<void> = async (db, session) => {
    const addProjeto = await RepositorioProjeto.adicionarProjeto(
      nomeProjeto,
      descricaoProjeto,
      emailProjeto,
      telefoneProjeto,
      enderecoProjeto,
      db,
      session
    );

    expect(addProjeto.success).toBe(true);

    if (!addProjeto.success) throw addProjeto.error;

    const resultadoAprovacao = await RepositorioProjeto.aprovarProjeto(
      emailProjeto,
      idPerfilResponsavel,
      db,
      session
    );
    expect(resultadoAprovacao.success).toBe(true);

    const readProjeto = await RepositorioProjeto.readProjetoPorEmail(
      emailProjeto,
      db,
      session
    );
    expect(readProjeto.success).toBe(true);

    if (!readProjeto.success) throw readProjeto.error;

    const projeto = readProjeto.data;
    expect(projeto.nome).toBe(nomeProjeto);
    expect(projeto.descricao).toBe(descricaoProjeto);
    expect(projeto.email).toBe(emailProjeto);
    expect(projeto.telefone).toBe(telefoneProjeto);
    expect(projeto.endereco).toStrictEqual(enderecoProjeto);
    expect(projeto.aprovado).toBe(true);

    if (!projeto.aprovado) return;

    expect(projeto.idPerfilResponsavel).toBe(idPerfilResponsavel);
    expect(projeto.cursos).toStrictEqual([]);

    const addCurso = await RepositorioProjeto.adicionarCurso(
      projeto.id,
      cursoSemAlunos,
      db,
      session
    );
    expect(addCurso.success).toBe(true);

    const cursos = await RepositorioProjeto.readCursosProjeto(
      projeto.id,
      db,
      session
    );
    if (!cursos.success) throw cursos.error;

    expect(cursos).toStrictEqual({
      success: true,
      data: [cursoSemAlunos],
    });
  };

  await withDatabaseTransaction(service, undefined, true);
});
