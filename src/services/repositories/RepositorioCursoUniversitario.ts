import { v4 as uuid } from 'uuid';
import { Db, ClientSession } from 'mongodb';
import { CursoUniversitario } from '../../models';
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
    [{ key: 'id', value: id }],
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
  return Database.updatePartialData<CursoUniversitario>(
    collection,
    [{ key: 'id', value: id }],
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
  return Database.remove<CursoUniversitario>(
    collection,
    [{ key: 'id', value: id }],
    db,
    session
  );
};

export default {
  addCursoUniversitario,
  readCursoUniversitario,
  updateCursoUniversitario,
  deleteCursoUniversitario,
};
