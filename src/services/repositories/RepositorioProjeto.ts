import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import { Curso, Endereco, Projeto } from 'tcc-models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database from '../data/Database';

const collection = 'Projeto';

const readProjeto = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Projeto>> => {
  return Database.readData<Projeto>(collection, 'id', id, db, session);
};

const readProjetoPorEmail = (
  email: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Projeto>> => {
  return Database.readData<Projeto>(collection, 'email', email, db, session);
};

const readCursosProjeto = (
  idProjeto: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Curso[]>> => {
  return Database.readDatas<Projeto, Curso>(
    collection,
    [
      {
        key: 'id',
        value: idProjeto,
      },
    ],
    db,
    session,
    ['cursos']
  );
};

const readCursosAluno = async (
  idAluno: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Curso[]>> => {
  return Database.readDatas<Projeto, Curso>(
    collection,
    [
      {
        key: 'cursos.turma',
        value: idAluno,
      },
    ],
    db,
    session,
    ['cursos']
  );
};

const adicionarProjeto = async (
  nome: string,
  descricao: string,
  email: string,
  telefone: number,
  endereco: Endereco,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const projeto: Projeto = {
    id: uuid(),
    nome: nome,
    descricao: descricao,
    email: email,
    telefone: telefone,
    requisicaoEntradaEm: new Date(),
    endereco: endereco,
    aprovado: false,
  };

  const result = await Database.addData<Projeto>(
    collection,
    projeto,
    db,
    session
  );
  if (!result.success) return result;

  return {
    success: true,
    data: projeto.id,
  };
};

const aprovarProjeto = (
  idProjeto: string,
  idPerfilResponsavel: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const projetoParcial: Partial<Projeto> & { id: string } = {
    id: idProjeto,
    aprovado: true,
    idPerfilResponsavel: idPerfilResponsavel,
    entradaEm: new Date(),
    cursos: [],
  };

  return Database.updateData<Projeto>(collection, projetoParcial, db, session);
};

const adicionarCurso = (
  idProjeto: string,
  curso: Curso,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  return Database.updatePushData(collection, idProjeto, curso, db, session);
};

export default {
  readProjeto,
  readProjetoPorEmail,
  readCursosProjeto,
  readCursosAluno,
  adicionarProjeto,
  aprovarProjeto,
  adicionarCurso,
};
