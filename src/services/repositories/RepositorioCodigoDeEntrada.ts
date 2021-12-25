import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import { TipoCodigoDeEntrada, CodigoDeEntrada } from '../../models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database, { SearchType } from '../data/Database';

const collection = 'CodigoDeEntrada';

const addCodigoDeEntrada = async (
  idProjeto: string,
  informacoes:
    | {
        tipo: TipoCodigoDeEntrada.Professor;
        idCurso: string;
        idMateria: string;
      }
    | { tipo: TipoCodigoDeEntrada.Aluno; idCurso: string },
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<CodigoDeEntrada>> => {
  const codigo: CodigoDeEntrada = {
    id: uuid(),
    idProjeto: idProjeto,
    geradoEm: new Date(),
    usado: false,
    ...informacoes,
  };

  const addResult = await Database.addData<CodigoDeEntrada>(
    collection,
    codigo,
    db,
    session
  );
  if (!addResult.success) return addResult;

  return {
    success: true,
    data: codigo,
  };
};

const readCodigoDeEntrada = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<CodigoDeEntrada>> => {
  return Database.readData<CodigoDeEntrada>(
    collection,
    [{ key: 'id', value: id }],
    db,
    session
  );
};

const readCodigosDeEntrada = (
  idProjeto: string | undefined,
  idCurso: string | undefined,
  idMateria: string | undefined,
  tipo: TipoCodigoDeEntrada | undefined,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<CodigoDeEntrada[]>> => {
  const searchFields: SearchType<CodigoDeEntrada>[] = [];

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

  return Database.readDatas<CodigoDeEntrada, CodigoDeEntrada>(
    collection,
    searchFields,
    db,
    session
  );
};

const usarCodigoDeEntrada = (
  id: string,
  idPerfil: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  return Database.updatePartialData<CodigoDeEntrada>(
    collection,
    [{ key: 'id', value: id }],
    { usado: true, usadoEm: new Date(), idPerfilUsou: idPerfil },
    db,
    session
  );
};

const removerCodigoDeEntrada = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  return Database.remove<CodigoDeEntrada>(
    collection,
    [{ key: 'id', value: id }],
    db,
    session
  );
};

export default {
  addCodigoDeEntrada,
  readCodigoDeEntrada,
  readCodigosDeEntrada,
  usarCodigoDeEntrada,
  removerCodigoDeEntrada,
};
