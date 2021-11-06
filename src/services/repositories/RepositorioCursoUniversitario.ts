import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import { CursoUniversitario } from 'tcc-models';
import { DatabaseResult } from '../../structure/databaseResult';
import Database from '../data/Database';

const collection = 'CursoUniversitario';

const addCursoUniversitario = async (
  curso: Omit<CursoUniversitario, 'id'>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<string>> => {
  const _curso: CursoUniversitario = {
    id: uuid(),
    ...curso,
  };

  const addResult = await Database.addData<CursoUniversitario>(
    collection,
    _curso,
    db,
    session
  );
  if (!addResult.success) return addResult;

  return {
    success: true,
    data: _curso.id,
  };
};

const readCursoUniversitario = (
  id: string,
  db: Db,
  sesion: ClientSession
): Promise<DatabaseResult<CursoUniversitario>> => {
  return Database.readData<CursoUniversitario>(
    collection,
    'id',
    id,
    db,
    sesion
  );
};

const updateCursoUniversitario = (
  id: string,
  curso: Partial<Omit<CursoUniversitario, 'id'>>,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  return Database.updateData<CursoUniversitario>(
    collection,
    'id',
    id,
    curso,
    db,
    session
  );
};

const deleteCursoUniversitario = (
  id: string,
  db: Db,
  session: ClientSession
): Promise<DatabaseResult<null>> => {
  return Database.remove<CursoUniversitario>(collection, 'id', id, db, session);
};

export default {
  addCursoUniversitario,
  readCursoUniversitario,
  updateCursoUniversitario,
  deleteCursoUniversitario,
};
