import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import { TipoCodigoDeEntrada, CodigoDeEntrada } from 'tcc-models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database from '../data/Database';

const collection = 'CodigoDeEntrada';

const addCodigoDeEntrada = async (
  idProjeto: string,
  informacoes:
    | { tipo: TipoCodigoDeEntrada.Professor; idMateria: string }
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
  return Database.readData<CodigoDeEntrada>(collection, 'id', id, db, session);
};

const usarCodigoDeEntrada = (
  id: string,
  idPerfil: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  //TODO: Vincular o aluno ou professor ao projeto
  //TODO: Fazer a verificação se não já foi usado
  return Database.updateData<CodigoDeEntrada>(
    collection,
    'id',
    id,
    { usado: false, usadoEm: new Date(), idPerfilUsou: idPerfil },
    db,
    session
  );
};

export default {
  addCodigoDeEntrada,
  readCodigoDeEntrada,
  usarCodigoDeEntrada,
};