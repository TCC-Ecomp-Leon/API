import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import { TipoCodigoDeEntrada, CodigoDeEntrada } from 'tcc-models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database from '../data/Database';

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
): Promise<DatabaseResult<string>> => {
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
    data: codigo.id,
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

export default {
  addCodigoDeEntrada,
  readCodigoDeEntrada,
  usarCodigoDeEntrada,
};
