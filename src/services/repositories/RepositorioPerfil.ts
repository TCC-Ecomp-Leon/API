import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import {
  InformacoesPerfil,
  Perfil,
  RegraPerfil,
  TipoCodigoDeEntrada,
} from '../../models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database from '../data/Database';
import RepositorioProjeto from './RepositorioProjeto';
import RepositorioCodigoDeEntrada from './RepositorioCodigoDeEntrada';
import RepositorioUniversitario from './RepositorioUniversitario';
import assets from '../../assets/images';

const collection = 'Perfil';

type TipoPerfilBanco = Omit<Perfil, 'associacoes' | 'universitario'>;

const addAdministrador = (
  /**
   * Mesmo identificador do serviço de login
   */
  id: string,
  email: string,
  nome: string,
  telefone: number,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const perfil: Perfil = {
    id: id,
    nome: nome,
    email: email,
    telefone: telefone,
    entradaEm: new Date(),
    fotoPerfil: defaultProfileImage,
    regra: RegraPerfil.Administrador,
  };

  return Database.addData<Perfil>(collection, perfil, db, session);
};

const addPerfilProjeto = async (
  /**
   * Mesmo identificador do serviço de login
   */
  id: string,
  emailProjeto: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const readProjeto = await RepositorioProjeto.readProjetoPorEmail(
    emailProjeto,
    db,
    session
  );
  if (!readProjeto.success) return readProjeto;

  const aprovarProjeto = await RepositorioProjeto.aprovarProjeto(
    emailProjeto,
    id,
    db,
    session
  );
  if (!aprovarProjeto.success) return aprovarProjeto;

  const projeto = readProjeto.data;

  const perfil: Perfil = {
    id: id,
    email: emailProjeto,
    nome: projeto.nome,
    telefone: projeto.telefone,
    entradaEm: new Date(),
    fotoPerfil: defaultProfileImage,
    regra: RegraPerfil.Projeto,
  };

  const addPerfil = await Database.addData<Perfil>(
    collection,
    perfil,
    db,
    session
  );
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
  id: string,
  email: string,
  nome: string,
  telefone: number,
  idCodigoDeEntrada: string | undefined,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<boolean>> => {
  if (idCodigoDeEntrada !== undefined) {
    const readCodigoDeEntrada =
      await RepositorioCodigoDeEntrada.readCodigoDeEntrada(
        idCodigoDeEntrada,
        db,
        session
      );

    if (!readCodigoDeEntrada.success) return readCodigoDeEntrada;

    const codigoDeEntrada = readCodigoDeEntrada.data;
    if (codigoDeEntrada.usado) {
      return {
        success: true,
        data: false,
      };
    }

    //Necessário consumir o código e realizar o processo de atribuíção do novo usuário
    //como professor ou aluno de acordo com as informações do código de entrada.
    if (codigoDeEntrada.tipo === TipoCodigoDeEntrada.Aluno) {
      const addAluno = await RepositorioProjeto.adicionarAlunoAoCurso(
        codigoDeEntrada.idProjeto,
        codigoDeEntrada.idCurso,
        id,
        db,
        session
      );

      if (!addAluno.success) return addAluno;
    } else if (codigoDeEntrada.tipo === TipoCodigoDeEntrada.Professor) {
      const addProfessor = await RepositorioProjeto.atribuirProfessorAMateria(
        codigoDeEntrada.idProjeto,
        codigoDeEntrada.idCurso,
        codigoDeEntrada.idMateria,
        id,
        db,
        session
      );

      if (!addProfessor.success) return addProfessor;
    }
  }

  const profile: TipoPerfilBanco = {
    id: id,
    email: email,
    nome: nome,
    telefone: telefone,
    entradaEm: new Date(),
    fotoPerfil: defaultProfileImage,
    regra: RegraPerfil.Geral,
  };

  const addProfile = await Database.addData<TipoPerfilBanco>(
    collection,
    profile,
    db,
    session
  );

  if (!addProfile.success) {
    return addProfile;
  }

  return {
    success: true,
    data: true,
  };
};

const readPerfil = async (
  id: string,
  email: string,
  emailValidado: boolean,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Perfil>> => {
  const identificadorPerfil: keyof Perfil = 'id';

  const readPerfil = await Database.readData<TipoPerfilBanco>(
    collection,
    [{ key: identificadorPerfil, value: id }],
    db,
    session
  );

  let perfil: Perfil;

  if (!readPerfil.success) return readPerfil;

  const regraPerfil = readPerfil.data.regra;

  if (regraPerfil === RegraPerfil.Geral) {
    const readCursosAluno = await RepositorioProjeto.readCursosAluno(
      readPerfil.data.id,
      db,
      session
    );
    if (!readCursosAluno.success) return readCursosAluno;

    const readMateriasProfessor =
      await RepositorioProjeto.readMateriasProfessor(
        readPerfil.data.id,
        db,
        session
      );
    if (!readMateriasProfessor.success) return readMateriasProfessor;

    const informacoesUniversitario =
      await RepositorioUniversitario.readInformacoesUniversitario(
        email,
        emailValidado,
        db,
        session
      );
    if (!informacoesUniversitario.success) return informacoesUniversitario;

    perfil = {
      ...readPerfil.data,
      associacoes: {
        aluno:
          readCursosAluno.data.length > 0
            ? {
                alunoParceiro: true,
                cursos: readCursosAluno.data,
              }
            : { alunoParceiro: false },
        professor:
          readMateriasProfessor.data.length > 0
            ? {
                professor: true,
                materiasProfessor: readMateriasProfessor.data,
              }
            : {
                professor: false,
              },
      },
      universitario: informacoesUniversitario.data,
      cpf: (readPerfil.data as any).cpf as string,
    };
  } else {
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

const atualizarPerfil = (
  idPerfil: string,
  info: Omit<Partial<Perfil>, 'associacoes' | 'universitario'>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const identificadorPerfil: keyof Perfil = 'id';

  return Database.updatePartialData(
    collection,
    [{ key: identificadorPerfil, value: idPerfil }],
    info,
    db,
    session
  );
};

const deletarPerfil = (
  idPerfil: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const identificadorPerfil: keyof Perfil = 'id';

  return Database.remove(
    collection,
    [{ key: identificadorPerfil, value: idPerfil }],
    db,
    session
  );
};

export default {
  addAdministrador,
  addPerfilProjeto,
  addPerfilGeral,
  readPerfil,
  atualizarPerfil,
  deletarPerfil,
};

const defaultProfileImage = assets.imgPerfil;
