import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import {
  Curso,
  Endereco,
  InformacoesProjeto,
  Materia,
  Projeto,
} from '../../models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database, { SearchType } from '../data/Database';

const collection = 'Projeto';

const readProjeto = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Projeto>> => {
  const identificadorProjeto: keyof Projeto = 'id';

  return Database.readData<Projeto>(
    collection,
    [{ key: identificadorProjeto, value: id }],
    db,
    session
  );
};

const readProjetos = (
  aprovado: boolean | undefined,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Projeto[]>> => {
  const searchParameters: SearchType<Projeto>[] = [];
  if (aprovado !== undefined) {
    const campoAprovacao: keyof Projeto = 'aprovado';

    searchParameters.push({
      key: campoAprovacao,
      value: aprovado,
    });
  }

  return Database.readDatas<Projeto, Projeto>(
    collection,
    searchParameters,
    db,
    session
  );
};

const readProjetoPorEmail = (
  email: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Projeto>> => {
  const identificadorProjeto: keyof Projeto = 'email';

  return Database.readData<Projeto>(
    collection,
    [{ key: identificadorProjeto, value: email }],
    db,
    session
  );
};

const readCursosProjeto = async (
  idProjeto: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Curso[]>> => {
  const cursos = await Database.readDatas<Projeto, { cursos: Curso[] }>(
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

  if (!cursos.success) return cursos;

  return {
    success: true,
    data: cursos.data.length > 0 ? cursos.data[0].cursos : [],
  };
};

const readCursosAluno = async (
  idAluno: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Curso[]>> => {
  const cursos = await Database.readDatas<Projeto, { cursos: Curso[] }>(
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

  if (!cursos.success) return cursos;

  const listaDeCursos: Curso[] =
    cursos.data.length > 0
      ? Array.prototype.concat.apply(
          [],
          cursos.data.map((curso) => curso.cursos)
        )
      : [];

  return {
    success: true,
    data: listaDeCursos.filter((curso) => curso.turma.includes(idAluno)),
  };
};

const readMateriasProfessor = async (
  idProfessor: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Materia[]>> => {
  const cursos = await Database.readDatas<
    Projeto,
    { cursos: { materias: Materia[] }[] }
  >(
    collection,
    [
      {
        key: 'cursos.materias.idPerfilProfessor',
        value: idProfessor,
      },
    ],
    db,
    session,
    ['cursos.materias']
  );

  if (!cursos.success) return cursos;

  const materias: Materia[] = [];
  cursos.data.forEach((projetoCursos) => {
    projetoCursos.cursos.forEach((curso) => {
      curso.materias.forEach((materia) => {
        materias.push(materia);
      });
    });
  });

  return {
    success: true,
    data: materias.filter(
      (materia) => materia.idPerfilProfessor === idProfessor
    ),
  };
};

const adicionarProjeto = async (
  nome: string,
  descricao: string,
  email: string,
  telefone: number,
  imgProjeto: string,
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
    imgProjeto: imgProjeto,
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
  emailProjeto: string,
  idPerfilResponsavel: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const identificadorProjeto: keyof Projeto = 'email';

  const projetoParcial: Partial<Projeto> = {
    aprovado: true,
    idPerfilResponsavel: idPerfilResponsavel,
    entradaEm: new Date(),
    cursos: [],
  };

  return Database.updatePartialData<Projeto>(
    collection,
    [
      {
        key: identificadorProjeto,
        value: emailProjeto,
      },
    ],
    projetoParcial,
    db,
    session
  );
};

const adicionarCurso = (
  idProjeto: string,
  curso: Omit<Curso, 'id' | 'atualizadoEm' | 'idProjeto' | 'turma'>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const identificadorProjeto: keyof Projeto = 'id';

  return Database.updatePushData<Projeto, Curso>(
    collection,
    [{ key: identificadorProjeto, value: idProjeto }],
    'cursos',
    {
      ...curso,
      id: uuid(),
      atualizadoEm: new Date(),
      idProjeto: idProjeto,
      turma: [],
    },
    db,
    session
  );
};

const adicionarMateria = async (
  idProjeto: string,
  idCurso: string,
  materia: Omit<Materia, 'id' | 'idPerfilProfessor' | 'idCurso'>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
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

  const _materia: Materia = {
    ...materia,
    id: uuid(),
    idCurso: idCurso,
  };

  const materias = [...cursos[indexCurso].materias, _materia];
  return await atualizarCurso(
    idProjeto,
    idCurso,
    { materias: materias },
    db,
    session
  );
};

const adicionarAlunoAoCurso = (
  idProjeto: string,
  idCurso: string,
  idAluno: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const identificadorProjeto: keyof Projeto = 'id';
  const identificadorCurso = 'cursos.id';

  return Database.updatePushData<Projeto, string>(
    collection,
    [
      { key: identificadorProjeto, value: idProjeto },
      { key: identificadorCurso, value: idCurso },
    ],
    'cursos.$.turma',
    idAluno,
    db,
    session
  );
};

const atribuirProfessorAMateria = (
  idProjeto: string,
  idCurso: string,
  idMateria: string,
  idProfessor: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const identificadorProjeto: keyof Projeto = 'id';
  const identificadorCurso = 'cursos.id';
  const identificadorMateria = 'cursos.materias.id';

  const identificadorProfessorMateria =
    'cursos.$[].materias.$[].idPerfilProfessor';

  return Database.updateGenericData<Projeto, string>(
    collection,
    [
      { key: identificadorProjeto, value: idProjeto },
      { key: identificadorCurso, value: idCurso },
      { key: identificadorMateria, value: idMateria },
    ],
    [{ key: identificadorProfessorMateria, value: idProfessor }],
    db,
    session
  );
};

const removerProjetoPorEmail = (
  email: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const campoEmail: keyof Projeto = 'email';

  return Database.remove(
    collection,
    [
      {
        key: campoEmail,
        value: email,
      },
    ],
    db,
    session
  );
};

const atualizarProjeto = (
  idProjeto: string,
  informacoes: Partial<
    Omit<InformacoesProjeto, 'id' | 'email' | 'requisicaoEntradaEm'>
  >,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const campoId: keyof Projeto = 'id';

  return Database.updatePartialData(
    collection,
    [{ key: campoId, value: idProjeto }],
    informacoes,
    db,
    session
  );
};

const atualizarCurso = (
  idProjeto: string,
  idCurso: string,
  curso: Partial<Omit<Curso, 'id' | 'atualizadoEm' | 'idProjeto' | 'turma'>>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const identificadorProjeto: keyof Projeto = 'id';
  const identificadorCurso = 'cursos.id';

  return Database.updateNestedPartialData<Projeto, Curso>(
    collection,
    [
      { key: identificadorProjeto, value: idProjeto },
      { key: identificadorCurso, value: idCurso },
    ],
    'cursos.$',
    { ...curso, atualizadoEm: new Date() },
    db,
    session
  );
};

export default {
  readProjeto, //testado
  readProjetos,
  readProjetoPorEmail, //testado
  readCursosProjeto, //testado
  readCursosAluno, //testado
  readMateriasProfessor, //testado
  adicionarProjeto, //testado
  aprovarProjeto, //testado
  adicionarCurso, //testado
  adicionarMateria,
  adicionarAlunoAoCurso, //testado
  atribuirProfessorAMateria, //testado
  removerProjetoPorEmail,
  atualizarProjeto,
  atualizarCurso,
};
