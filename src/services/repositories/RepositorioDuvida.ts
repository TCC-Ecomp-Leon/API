import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import { Duvida } from '../../models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database from '../data/Database';

const collection = 'Duvida';

const adicionarDuvida = async (
  titulo: string,
  descricao: string,
  idAluno: string,
  idCurso: string,
  idMateria: string | null,
  primeiraMensagem: string,
  idCursoUniversitario: string | null,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const duvida: Duvida = {
    id: uuid(),
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

  const result = await Database.addData<Duvida>(
    collection,
    duvida,
    db,
    session
  );

  if (!result.success) return result;

  return {
    success: true,
    data: duvida.id,
  };
};

const readDuvida = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Duvida>> => {
  return Database.readData<Duvida>(
    collection,
    [{ key: 'id', value: id }],
    db,
    session
  );
};

const readDuvidasEspecificas = (
  key: keyof Duvida,
  value: any,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<Duvida[]>> => {
  return Database.readDatas<Duvida, Duvida>(
    collection,
    [{ key: key, value: value }],
    db,
    session
  );
};

const fecharDuvida = async (
  idDuvida: string,
  idPerfil: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  const campoMensagem: keyof Duvida = 'mensagens';
  const mensagemFechar: Duvida['mensagens'][0] = {
    idPerfil: idPerfil,
    mensagem: 'DÚVIDA FECHADA',
    horario: new Date(),
  };
  const resultMensagemFechar = await Database.updatePushData<
    Duvida,
    Duvida['mensagens'][0]
  >(
    collection,
    [{ key: 'id', value: idDuvida }],
    campoMensagem,
    mensagemFechar,
    db,
    session
  );

  if (!resultMensagemFechar.success) return resultMensagemFechar;

  const fecharDuvida = await Database.updateGenericData<Duvida, boolean>(
    collection,
    [{ key: 'id', value: idDuvida }],
    [{ key: 'resolvida', value: true }],
    db,
    session
  );

  return fecharDuvida;
};

export default {
  adicionarDuvida,
  readDuvida,
  readDuvidasEspecificas,
  fecharDuvida,
};
